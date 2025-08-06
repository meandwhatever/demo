
export function build_shipment_json({
    mbl_rawJson,
    hbl_rawJson,
    mode,
    shipmentId,
    user,
  }: {

    mbl_rawJson?: any;
    hbl_rawJson?: any;
    mode: string;
    shipmentId: string;
    user: string;
  }) {
    console.log("build_shipment_json component is called");
    const now = new Date().toISOString();
    const template = `{
        "shipment_info": {
          "shipment_id": "",
          "created_at": "",
          "created_by": "",
          "updated_at": "",
          "updated_by": "",
          "updated_reason": "",
          "related_shipment_ids": []
        },
        "involved_party": {
          "shipper_name": "",
          "shipper_address": "",
          "shipper_city": "",
          "shipper_state": "",
          "shipper_country": "",
          "consignee_name": "",
          "consignee_address": "",
          "consignee_city": "",
          "consignee_state": "",
          "consignee_country": "",
          "consignee_postal_code": "",
          "orgin_agent_name": "",
          "orgin_agent_address": "",
          "orgin_agent_city": "",
          "orgin_agent_state": "",
          "orgin_agent_country": "",
          "orgin_agent_postal_code": "",
          "destination_agent_name": "",
          "destination_agent_address": "",
          "destination_agent_city": "",
          "destination_agent_state": "",
          "destination_agent_country": "",
          "destination_agent_postal_code": ""
        },
        "shipment": {
          "master_bill_of_lading_number": "",
          "house_bill_of_lading_number": "",
          "carrier_scac_code": "",
          "carrier_booking_number": "",
          "vessel_name": "",
          "voyage_number": "",
          "port_of_loading": "",
          "port_of_discharge": "",
          "place_of_receipt": "",
          "place_of_delivery": "",
          "estimated_time_of_departure": "",
          "estimated_time_of_arrival": "",
          "actual_time_of_departure": "",
          "actual_time_of_arrival": "",
          "date_of_release": "",
          "place_of_release": "",
          "shipped_on_board_date": "",
          "freight_mode": "",
          "freight_term": "",
          "freight_service": "",
          "total_number_of_containers": 0,
          "total_weight": 0,
          "total_volume": 0,
          "total_package": 0
        },
        "containers": [
          {
            "container_number": "",
            "seal_number": "",
            "container_type": "",
            "number_of_packages": 0,
            "package_uom": "",
            "weight": 0,
            "weight_uom": "",
            "volume": 0,
            "volume_uom": "",
            "product_item_description": "",
            "product_item_hscode": ""
          }
        ],
        "freight_charges": [
          {
            "charge_name": "",
            "rate": 0,
            "quantity": 0,
            "amount": 0,
            "prepaid_or_collect": ""
          }
        ],
        "customs": [
          {
            "product_id": "",
            "product_description": "",
            "product_origin": "",
            "hs_code": "",
            "Quantity": "",
            "Rate": 0,
            "total_amount": 0,
            "Currency": 0
          }
        ],
        "shipping_documents": [
          {
            "document_id": "",
            "document_type": "",
            "document_url": "",
            "processing_result_status_code": "",
            "processing_result_status_timestamp": ""
          }
        ],
        "validation_result": [
          {
            "field_name": "",
            "validation_status": "",
            "validation_type": "",
            "validated_value": "",
            "validation_data_source": [
              {
                "data_source": "",
                "value": ""
              }
            ]
          }
        ]
      }`;

      const shipment_json=JSON.parse(template);
      shipment_json.shipment_info.shipment_id=shipmentId;
      //shipment_json.shipment_info.created_at=now;
      //shipment_json.shipment_info.created_by=user;
      shipment_json.shipment_info.updated_at=now;
      shipment_json.shipment_info.updated_by=user;
      //shipment_json.shipment_info.updated_reason=mode;
      if(hbl_rawJson !== undefined){
        console.log("hbl_rawJson is defined");
        shipment_json.involved_party.shipper_name=hbl_rawJson.shipment.shipper_name;
        shipment_json.involved_party.shipper_address=hbl_rawJson.shipment.shipper_address;
        shipment_json.involved_party.consignee_name=hbl_rawJson.shipment.consignee_name;
        shipment_json.involved_party.consignee_address=hbl_rawJson.shipment.consignee_address;


        shipment_json.shipment.master_bill_of_lading_number=hbl_rawJson.shipment.mbl_number;
        shipment_json.shipment.house_bill_of_lading_number=hbl_rawJson.shipment.hbl_number;
        shipment_json.shipment.carrier_scac_code=hbl_rawJson.shipment.carrier_scac_code;
        shipment_json.shipment.carrier_booking_number=hbl_rawJson.shipment.carrier_booking_number;
        shipment_json.shipment.vessel_name=hbl_rawJson.shipment.vessel_name;
        shipment_json.shipment.voyage_number=hbl_rawJson.shipment.voyage_number;
        shipment_json.shipment.port_of_loading=hbl_rawJson.shipment.port_of_loading;
        shipment_json.shipment.port_of_discharge=hbl_rawJson.shipment.port_of_discharge;
        shipment_json.shipment.place_of_receipt=hbl_rawJson.shipment.place_of_receipt;
        shipment_json.shipment.place_of_delivery=hbl_rawJson.shipment.place_of_delivery;
        //shipment_json.shipment.estimated_time_of_departure=hbl_rawJson.shipment.estimated_time_of_departure;
        //shipment_json.shipment.estimated_time_of_arrival=hbl_rawJson.shipment.estimated_time_of_arrival;
        //shipment_json.shipment.actual_time_of_departure=hbl_rawJson.shipment.actual_time_of_departure;
        //shipment_json.shipment.actual_time_of_arrival=hbl_rawJson.shipment.actual_time_of_arrival;
        //shipment_json.shipment.date_of_release=hbl_rawJson.shipment.date_of_release;
        shipment_json.shipment.freight_mode=hbl_rawJson.shipment.mode;
        shipment_json.shipment.freight_term=hbl_rawJson.shipment.freight_term;
        shipment_json.shipment.freight_service=hbl_rawJson.shipment.freight_service;
        shipment_json.shipment.total_number_of_containers=hbl_rawJson.shipment.total_number_of_containers;
        shipment_json.shipment.total_weight=hbl_rawJson.shipment.total_weight;
        shipment_json.shipment.total_volume=hbl_rawJson.shipment.total_volume;
        shipment_json.shipment.total_package=hbl_rawJson.shipment.total_package;
        shipment_json.containers=hbl_rawJson.containers;
        shipment_json.freight_charges=hbl_rawJson.freight_charges;
        //shipment_json.customs=hbl_rawJson.customs;
        //shipment_json.shipping_documents=hbl_rawJson.shipping_documents;
        //shipment_json.validation_result=hbl_rawJson.validation_result;



      }
      if(mbl_rawJson !== undefined){
        console.log("mbl_rawJson is defined");





        shipment_json.shipment.freight_mode=mbl_rawJson.shipment.mode;
        shipment_json.shipment.freight_term=mbl_rawJson.shipment.freight_term;
        shipment_json.shipment.freight_service=mbl_rawJson.shipment.freight_service;
        shipment_json.shipment.master_bill_of_lading_number=mbl_rawJson.shipment.mbl_number;

        shipment_json.involved_party.orgin_agent_name=mbl_rawJson.shipment.shipper_name;
        shipment_json.involved_party.orgin_agent_address=mbl_rawJson.shipment.shipper_address;
        shipment_json.involved_party.destination_agent_name=mbl_rawJson.shipment.consignee_name;
        shipment_json.involved_party.destination_agent_address=mbl_rawJson.shipment.consignee_address;

        
    }
    return shipment_json;
      
  }