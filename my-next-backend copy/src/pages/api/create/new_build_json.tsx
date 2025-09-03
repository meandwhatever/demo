//take mbl_json and hbl_jso and shipment id and combine them into a shipment_json
//mbl structure
/*
{
    "shipper": {
      "name":              "",  // String
      "address":           "",  // String
  
    },
    "consignee": {
      "name":            "",  // String
      "address":         "",  // String
  
    },
    "notify_party": {
      "name":         "",  // String
      "address":      "",  // String
  
    },
    "shipment": {
      "mbl_number": "",  // String
      "carrier_scac_code":            "",  // String
      "carrier_booking_number":       "",  // String
      "vessel_name":                  "",  // String
      "voyage_number":                "",  // String
      "port_of_loading":              "",  // String
      "port_of_discharge":            "",  // String
      "place_of_receipt":             "",  // String
      "place_of_delivery":            "",  // String
      "place_of_release":             "",  // String
      "date_of_release":              null,  // String (ISO Date)
      "shipped_on_board_date":        null   // String (ISO Date)
      "mode":            "",  // String (e.g. "FCL", "LCL")
      "freight_term":    "",  // String (e.g. "Prepaid", "Collect")
      "freight_service": ""   // String (e.g. "Door‑to‑Door")
      "total_number_of_containers": null,  // Number (integer)
      "total_weight":               null,  // String (e.g. "10000 kg")
      "total_volume":               null,  // String (e.g. "10000 m3")
      "total_package":              null   // String (e.g. "10000 pcs")
    },
  
  
    "freight_charges": [
      {
        "charge_name": "",  // String
        "rate":        null,  // Number
        "quantity":    null,  // Number (integer)
        "unit(Currency)": "",  //String
        "amount":      null,  // Number
        "prepaid or collect":   "",  // String(write "prepaid" or "collect", or "" if not found)
  
      }
      // … repeat for each line item
    ],
    "containers": [
      {
        "container_number":            "",  // String
        "seal_number":                 "",  // String
        "container_type":              "",  // String
        "number_of_packages":          null,  // Number (integer)
        "package_uom":                 "",  // String
        "weight":                      null,  // Number
        "weight_uom":                  "",  // String
        "volume":                      null,  // Number
        "volume_uom":                  "",  // String
        "product_item_description":    "",  // String
        "product_item_hscode":         ""   // String
      }
      // … repeat for each container
    ]
  }
*/

//hbl structure
/*
{
    "shipper": {
      "name":              "",  // String
      "address":           "",  // String
  
    },
    "consignee": {
      "name":            "",  // String
      "address":         "",  // String
  
    },
    "notify_party": {
      "name":         "",  // String
      "address":      "",  // String
  
    },
    "shipment": {
      "hbl_number": "",  // String
      "mbl_number": "",  // String
      "vessel_name":                  "",  // String
      "voyage_number":                "",  // String
      "port_of_loading":              "",  // String
      "port_of_discharge":            "",  // String
      "place_of_receipt":             "",  // String
      "place_of_delivery":            "",  // String
      "place_of_issue":             "",  // String
      "date_of_issue":              null,  // String (ISO Date)
      "shipped_on_board_date":        null   // String (ISO Date)
      "mode":            "",  // String (e.g. "FCL", "LCL", "AIR")
      "freight_term":    "",  // String (e.g. "Prepaid", "Collect")
      "freight_service": ""   // String (e.g. "Door‑to‑Door")
      "total_number_of_containers": null,  // Number (integer)
      "total_weight":               null,  // String (e.g. "10000 kg")
      "total_volume":               null,  // String (e.g. "10000 m3")
      "total_package":              null   // String (e.g. "10000 pcs")
    },
  
  
    "freight_charges": [
      {
        "charge_name": "",  // String
        "rate":        null,  // Number
        "quantity":    null,  // Number (integer)
        "unit(Currency)": "",  //String
        "amount":      null,  // Number
        "prepaid or collect":   "",  // String(write "prepaid" or "collect", or "" if not found)
  
      }
      // … repeat for each line item
    ],
    "containers": [
      {
        "container_number":            "",  // String
        "seal_number":                 "",  // String
        "container_type":              "",  // String
        "number_of_packages":          null,  // Number (integer)
        "package_uom":                 "",  // String
        "weight":                      null,  // Number
        "weight_uom":                  "",  // String
        "volume":                      null,  // Number
        "volume_uom":                  "",  // String
        "product_item_description":    "",  // String
        "product_item_hscode":         ""   // String
      }
      // … repeat for each container
    ]
  }
*/

//shipment structure
/*
1.   "shipment_id": String,
2.     "created_at": Date,
3.     "created_by": String,
4.  "involved_party": {
5.         "shipper_name": String,
6.         "shipper_address": String,
7.         "consignee_name": String,
8.         "consignee_address": String,
9.         "orgin_agent_name": String,
10.         "orgin_agent_address": String,         
11.         "destination_agent_name": String,   
12.         "destination_agent_address": String,
13. 

1.   },
2.  "shipment": {
3.     "master_bill_of_lading_number": String,
4.     "house_bill_of_lading_number": String,
5.     "vessel_name": String,
6.     "voyage_number": String,
7.     "port_of_loading": String,
8.     "port_of_discharge": String,
9.     "place_of_receipt": String,       
10.     "place_of_delivery": String,
11.     "freight_mode": string,
12.  "total_number_of_containers": number,
13.     "total_weight": number,
14.     "total_volumn": number,
15.     "total_package": number
16.   },
17. "containers": [
18.     {
19.       "container_number": string,
20.       "seal_number": string,
21.       "container_type": string,
22.       "number_of_packages": number,
23.       "package_uom": string,
24.       "weight": number,
25.       "weight_uom": string,
26.       "volume": number,
27.       "volume_uom": string,
28.       "product_item_description": string,
29.       "product_item_hscode": string
30.     }

*/



export function combineMBLAndHBLToShipment(
    mbl_json: any,
    hbl_json: any,
    shipmentId: string
  ){
    const shipment_json = {
        "shipment_id": shipmentId,
        "created_at": new Date().toISOString(),
        "created_by": "user",
        "involved_party": {
            "shipper_name": hbl_json?.shipper?.name ?? null,
            "shipper_address": hbl_json?.shipper?.address ?? null,
            "consignee_name": hbl_json?.consignee?.name ?? null,
            "consignee_address": hbl_json?.consignee?.address ?? null,
            "orgin_agent_name": mbl_json?.shipper?.name ?? null,
            "orgin_agent_address": mbl_json?.shipper?.address ?? null,
            "destination_agent_name": mbl_json?.consignee?.name ?? null,
            "destination_agent_address": mbl_json?.consignee?.address ?? null,
        },
        "shipment": {
            "master_bill_of_lading_number": mbl_json?.shipment?.mbl_number ?? hbl_json?.shipment?.mbl_number ?? null,
            "house_bill_of_lading_number": hbl_json?.shipment?.hbl_number ?? null,
            "vessel_name": mbl_json?.shipment?.vessel_name ?? hbl_json?.shipment?.vessel_name ?? null,
            "voyage_number": mbl_json?.shipment?.voyage_number ?? hbl_json?.shipment?.voyage_number ?? null,
            "port_of_loading": mbl_json?.shipment?.port_of_loading ?? hbl_json?.shipment?.port_of_loading ?? null,
            "port_of_discharge": mbl_json?.shipment?.port_of_discharge ?? hbl_json?.shipment?.port_of_discharge ?? null,
            "place_of_receipt": mbl_json?.shipment?.place_of_receipt ?? hbl_json?.shipment?.place_of_receipt ?? null,
            "place_of_delivery": mbl_json?.shipment?.place_of_delivery ?? hbl_json?.shipment?.place_of_delivery ?? null,
            "freight_mode": mbl_json?.shipment?.mode ?? hbl_json?.shipment?.mode ?? null,
            "total_number_of_containers": mbl_json?.shipment?.total_number_of_containers ?? hbl_json?.shipment?.total_number_of_containers ?? null,
            "total_weight": mbl_json?.shipment?.total_weight ?? hbl_json?.shipment?.total_weight ?? null,
            "total_volume": mbl_json?.shipment?.total_volume ?? hbl_json?.shipment?.total_volume ?? null,
            "total_package": mbl_json?.shipment?.total_package ?? hbl_json?.shipment?.total_package ?? null,
        },

        "containers": mbl_json?.containers ?? hbl_json?.containers ?? null,
        "freight_charges": mbl_json?.freight_charges ?? hbl_json?.freight_charges ?? null,
    }
    return shipment_json;
  }

