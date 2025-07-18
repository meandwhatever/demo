// pages/api/upload/index.ts
// this is the api endpoint for the upload page
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";
import { spawnSync } from "child_process";

const prisma = new PrismaClient();



// file path of extractors for different file types
const EXTRACTORS: Record<string, string> = {
  mbl: "./src/ai/mbl.py",
  hbl: "./src/ai/hbl.py",
 
};

// The Python script that classifies a raw PDF and prints a JSON object
// containing `{ "filetype": "…" }` to stdout.
const CLASSIFIER_SCRIPT = "./src/ai/whichtype.py";


// Turn off Next.js’s default body parser so Formidable can parse multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// A simple response type for JSON
type ResponseData = {
  success: boolean;
  message?: string;
  //post
  documentId?: number;
  fileUrl?: string;
  rawJson?: any; 
  fileType?:   string; //mbl, hbl, etc
  fileId?:     string | number;
  id?:        number;
  action?: string
  mbl_Number?: string;
  hbl_Number?: string;
  //get
  data?: any;

};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  // GET request: fetch all documents for the landing page
  if (req.method === "GET") {
    console.log("GET request received for landing page");
    try {
      // ← simple fetch of only the MblDocument table
      const docs = await prisma.mbl_Document.findMany();
      return res.status(200).json({ success: true, data: docs });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: "Error fetching documents" });
    }
  }



  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  // Create a new Formidable form parser
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
  });

  // Parse the incoming request — note: make this callback async so we can use await inside
  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("❌ Formidable parse error:", err);
      res
        .status(500)
        .json({ success: false, message: "Error parsing form data: " + err.message });
      return;
    }

    // Extract the uploaded file; files.file can be undefined, a single File, or an array of File[]
    const maybeFile = files.file as FormidableFile | FormidableFile[] | undefined;
    if (!maybeFile) {
      console.error("⚠️  No file found in request");
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    // If it's an array, take the first; otherwise use it directly
    const file: FormidableFile = Array.isArray(maybeFile) ? maybeFile[0] : maybeFile;

    let destPath: string

    // STEP 1: Move the temp file into public/uploads/
    let safeName: string;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const originalName = file.originalFilename || "uploaded.pdf";
      //safe name is the timestamp and the original name
      safeName = `${timestamp}-${originalName}`;
      //dest path is the uploads directory and the safe name
      destPath = path.join(uploadsDir, safeName);
      console.log("destPath is", destPath);

      fs.renameSync(file.filepath, destPath);
    } catch (moveErr: any) {
      console.error("❌ Failed to move uploaded PDF:", moveErr);
      res.status(500).json({ success: false, message: "Could not save file." });
      return;
    }


    // STEP 2: Classify the PDF → detect file type
    const classify = spawnSync("python3", [CLASSIFIER_SCRIPT, destPath], {
      encoding: "utf-8",
    });

    if (classify.error || classify.status !== 0) {
      console.error(classify.stderr.toString());
      return res.status(500).json({ success: false, message: "File‑type classification failed" });
    }
      
    //get the file type from the classifier
    let detectedType: string;
    try {
      console.log("classify.stdout", classify.stdout);
      detectedType = classify.stdout.trim().toLowerCase();
      console.log("detectedType is ", detectedType);
    } catch {
      return res.status(500).json({ success: false, message: "Classifier returned invalid JSON" });
    }





    console.log("pass step 2")




      // STEP 2.5: read json

    let aiResult: any;

    const extractorScript = EXTRACTORS[detectedType];
    const extract = spawnSync("python3", [extractorScript, destPath], { encoding: "utf-8" });

    if (extract.error || extract.status !== 0) {
      console.error(extract.stderr.toString());
      return res.status(500).json({ success: false, message: "JSON extraction failed" });
    }

    // Each extractor writes a JSON file under <type>_json/<filename>.json
    const jsonDir = path.join(process.cwd(), `${detectedType}_json`);
    const jsonOutputPath = path.join(jsonDir, `${safeName}.json`);
    console.log("jsonOutputPath is", jsonOutputPath);
    if (!fs.existsSync(jsonOutputPath)) {
      return res.status(500).json({ success: false, message: "Extractor did not produce JSON output" });
    }

    aiResult = JSON.parse(fs.readFileSync(jsonOutputPath, "utf-8"));




    console.log("pass step 2.5")  
    
    

    // STEP 3: Save info to database
    let action: "created" | "updated" | "skipped";
    action = "skipped";
    let doc: any;
    const publicUrl = `/uploads/${safeName}`;


    let fileid="";
    if(detectedType === "mbl"){
      fileid = aiResult.shipment.mbl_number;
      const existing = await prisma.mbl_Document.findUnique({
        where: { file_id: fileid as string },
      });
      if(existing){
        console.log("File already exists, updating");
        doc = await prisma.mbl_Document.update({
          where: { id: existing.id },
          data: {
            file_name: safeName,
            rawJson: aiResult,
            file_Url: publicUrl,
            file_id: fileid,
          },
        });
        action = "updated";
      } else {//Document
        doc = await prisma.mbl_Document.create({
          data: {
            file_name: safeName,
            rawJson: aiResult,
            file_Url: publicUrl,
            file_id: fileid,
          },
        });
        action = "created";
      }


    }
    //hbl
    else if(detectedType === "hbl"){
      fileid = aiResult.shipment.hbl_number;
      const existing = await prisma.hbl_Document.findUnique({
        where: { file_id: fileid as string },
      });
      if(existing){
        console.log("File already exists, updating");
        doc = await prisma.hbl_Document.update({
          where: { id: existing.id },
          data: {
            file_name: safeName,
            rawJson: aiResult,
            file_Url: publicUrl,
            file_id: fileid,
            mbl_Number: aiResult.shipment.mbl_number,

          },
        });
        action = "updated";
      } else {//Document
        doc = await prisma.hbl_Document.create({
          data: {
            file_name: safeName,
            rawJson: aiResult,
            file_Url: publicUrl,
            file_id: fileid,
            mbl_Number: aiResult.shipment.mbl_number,
            
          },
        });
        action = "created";
      }
    }

    if(fileid == "" || action == "skipped" || detectedType == ""){
      return res.status(500).json({ success: false, message: "something went wrong in step 3" });
    }

    //final step: return the response
    res.status(200).json({ 
      success: true,
      documentId: doc.id ,
      fileUrl:  publicUrl,
      rawJson: aiResult,
      fileType: detectedType,
      fileId: doc.file_id, 
      id: doc.id, 
      action: action, 
      //mbl_Number: doc.mbl_Number, 
      //hbl_Number: doc.hbl_Number
    });
    return;






/*
    try {
      let doc;
      const publicUrl = `/uploads/${safeName}`;


      const existing = await prisma.document.findUnique({
        where: { fileid: fileid as string },
      });

      if(existing){
        console.log("File already exists, updating");
        doc = await prisma.document.update({
          where: { id: existing.id },
          data: {
            filename: safeName,
            rawJson: aiResult,
            fileUrl: publicUrl,
            filetype: detectedType,
          },
        });
        action = "updated";
      } else {//Document
        doc = await prisma.document.create({
          data: {
            filename: safeName,
            rawJson: aiResult,
            fileUrl: publicUrl,
            filetype: detectedType, //mbl,hbl...
            fileid: fileid,
          },
        });
        action = "created";
      }





// insert more data into prisma here




        console.log("✅ All steps succeeded; sending success response")
        console.log("doc.id", doc.id);
        res.status(200).json({ success: true, documentId: doc.id , fileUrl:  publicUrl, rawJson: aiResult,fileType: doc.filetype, fileId: doc.fileid, id: doc.id, action: action});
        return;
      } catch (dbErr: any) {
        console.error("❌ Database save error:", dbErr);
        res
          .status(500)
          .json({ success: false, message: "Failed to save to database" });
        return;
      }
*/
    
    
    
    
  });
}