// pages/api/update/doc.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  if (req.method === "POST") {
    // Expecting { rawJson: { … } } in the body
    const { id, rawJson, fileType } = req.body;
    const idInt = parseInt(id);
    console.log("id: ", id);
    console.log("rawJson: ", rawJson);
    console.log("fileType: ", fileType);

    if (typeof rawJson !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    try {
      if(fileType === 'mbl'){
        console.log("Updating mbl document of id: ", id);
        const updated = await prisma.mbl_Document.update({
          where: { id: idInt },
          data: { rawJson: rawJson, file_id: rawJson.shipment.mbl_number },

        }
      );
      console.log("mbl updated in doc.ts");
      return res.status(200).json({ success: true, data: updated });

      }else if(fileType === 'hbl'){
        console.log("Updating hbl document of id: ", id);
        const updated = await prisma.hbl_Document.update({
          where: { id: idInt },
          data: { rawJson: rawJson, file_id: rawJson.shipment.hbl_number, mbl_Number: rawJson.shipment.mbl_number },

        }
      );
      console.log("hbl updated in doc.ts");
      return res.status(200).json({ success: true, data: updated });

      } else {
        return res.status(400).json({ error: "Invalid file type, not mbl or hbl" });
      }
    } catch (error: any) {
      console.error("Prisma update error:", error);
      return res.status(500).json({ error: "Database update failed" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);

  return res.status(405).end();
}