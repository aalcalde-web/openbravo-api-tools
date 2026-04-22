var DATA_ORDERS = [
  {
    "endpoint": "COMMIT",
    "direction": "Request",
    "level": "ORDER",
    "path": "data.rollback",
    "name": "rollback",
    "type": "boolean",
    "description": "Internal flag indicating if the commit is a rollback (retry after failure).",
    "howItWorks": "If rollback=true and the commit fails, the error message uses EXO_CommitRollbackFailure instead of EXO_CommitFailure. Sent to the external service in the request payload.",
    "codeRef": "CommitExternalOrder.js L13"
  },
  {
    "endpoint": "COMMIT",
    "direction": "Request",
    "level": "ORDER",
    "path": "data.notificationMessage",
    "name": "notificationMessage",
    "type": "string",
    "description": "Notification message to display on commit failure.",
    "howItWorks": "Used internally by the POS to show a notification on error. Included in the commit params but not sent to the external service (consumed locally).",
    "codeRef": "CommitExternalOrderActionPreparation.js L19"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.isLayaway",
    "name": "isLayaway",
    "type": "boolean",
    "description": "Indicates whether the order is a layaway.",
    "howItWorks": "Frontend reads it in addBasicProperties(): isLayaway: !!newTicket.isLayaway. If not sent, defaults to false.",
    "codeRef": "LoadExternalOrdersTicket.js L360"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.obpos2Crm",
    "name": "obpos2Crm",
    "type": "string",
    "description": "ID of the External Business Partner Configuration (CRM connector).",
    "howItWorks": "Frontend reads it in addBasicProperties(): newTicket.obpos2Crm || terminal default. If not sent, uses the terminal's externalBpIntegration.id.",
    "codeRef": "LoadExternalOrdersTicket.js L362-363"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.businessPartner",
    "name": "businessPartner",
    "type": "object",
    "description": "Full business partner object to assign to the ticket. Different from externalBusinessPartnerReference (which is just a string reference).",
    "howItWorks": "Frontend reads it in addAnonymousBusinessPartnerToTicket(). If not sent, uses the terminal's anonymous BP.",
    "codeRef": "LoadExternalOrdersTicket.js L95-113"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.description",
    "name": "description",
    "type": "string",
    "description": "Order description.",
    "howItWorks": "Preserved via spread (...newTicket). Backend maps it to C_ORDER.DESCRIPTION via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.DESCRIPTION"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.deliveryNotes",
    "name": "deliveryNotes",
    "type": "string",
    "description": "Delivery notes for the order.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.DELIVERYNOTES via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.DELIVERYNOTES"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.poReference",
    "name": "poReference",
    "type": "string",
    "description": "Purchase order reference.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.POREFERENCE via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.POREFERENCE"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.datePromised",
    "name": "datePromised",
    "type": "string (date)",
    "description": "Promised delivery date.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.DATEPROMISED via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.DATEPROMISED"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.obposSequencename",
    "name": "obposSequencename",
    "type": "string",
    "description": "POS sequence name.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.EM_OBPOS_SEQUENCENAME via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.EM_OBPOS_SEQUENCENAME"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.obpos2Isdraftorder",
    "name": "obpos2Isdraftorder",
    "type": "boolean",
    "description": "Indicates whether it is a draft order.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.EM_OBPOS2_ISDRAFTORDER via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.EM_OBPOS2_ISDRAFTORDER"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.obpos2Createdfromdraftord",
    "name": "obpos2Createdfromdraftord",
    "type": "boolean",
    "description": "Created from a draft order.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.EM_OBPOS2_CREATEDFROMDRAFTORD via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.EM_OBPOS2_CREATEDFROMDRAFTORD"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "ORDER",
    "path": "data.obpos2CreatedInPos",
    "name": "obpos2CreatedInPos",
    "type": "boolean",
    "description": "Created in POS.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDER.EM_OBPOS2_CREATED_IN_POS via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDER.EM_OBPOS2_CREATED_IN_POS"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].skipApplyPromotions",
    "name": "skipApplyPromotions",
    "type": "boolean",
    "description": "If true, promotions will not be recalculated for this line.",
    "howItWorks": "Frontend reads it in addBasicProperties(): if null/undefined, defaults to line.isEditable !== false.",
    "codeRef": "LoadExternalOrdersTicket.js L377-379"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].allowProductDeletion",
    "name": "allowProductDeletion",
    "type": "boolean",
    "description": "Indicates whether the line can be deleted. Functional equivalent of isDeletable but this is the field actually read by the frontend.",
    "howItWorks": "Frontend reads it in addPermissionPropertiesToTicketAndLines(): defaults to true if not sent. Note: isDeletable IS in Swagger but the frontend reads allowProductDeletion.",
    "codeRef": "LoadExternalOrdersTicket.js L327-332"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].promotions",
    "name": "promotions",
    "type": "array",
    "description": "Array of promotions/discounts already applied to the line.",
    "howItWorks": "Preserved via spread (...line). Passed through to the backend which processes them in transformPromotions().",
    "codeRef": "LoadExternalOrdersTicket.js via spread + ExternalOrderLoader.transformPromotions()"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].description",
    "name": "description",
    "type": "string",
    "description": "Line description.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.DESCRIPTION via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.DESCRIPTION"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obposEpccode",
    "name": "obposEpccode",
    "type": "string",
    "description": "EPC code for the line item.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS_EPCCODE via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS_EPCCODE"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obposSerialnumber",
    "name": "obposSerialnumber",
    "type": "string",
    "description": "Serial number for the line item.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS_SERIALNUMBER via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS_SERIALNUMBER"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obposSalesunitfactor",
    "name": "obposSalesunitfactor",
    "type": "number",
    "description": "Sales unit factor.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS_SALESUNITFACTOR via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS_SALESUNITFACTOR"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obposGroupdesc",
    "name": "obposGroupdesc",
    "type": "string",
    "description": "Group description.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS_GROUPDESC via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS_GROUPDESC"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obrdmAmttopayindelivery",
    "name": "obrdmAmttopayindelivery",
    "type": "number",
    "description": "Amount to pay on delivery.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBRDM_AMTTOPAYINDELIVERY via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBRDM_AMTTOPAYINDELIVERY"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obpos2Waitingtime",
    "name": "obpos2Waitingtime",
    "type": "number",
    "description": "Waiting time.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS2_WAITINGTIME via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS2_WAITINGTIME"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].obpos2PrintpriceOptions",
    "name": "obpos2PrintpriceOptions",
    "type": "string",
    "description": "Print price options.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.EM_OBPOS2_PRINTPRICEOPTIONS via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.EM_OBPOS2_PRINTPRICEOPTIONS"
  },
  {
    "endpoint": "LOAD",
    "direction": "Response",
    "level": "LINE",
    "path": "data.lines[].ingredientsArray",
    "name": "ingredientsArray",
    "type": "string (JSON)",
    "description": "Ingredients array as JSON string.",
    "howItWorks": "Preserved via spread. Backend maps it to C_ORDERLINE.INGREDIENTSARRAY via fillBobFromJSON.",
    "codeRef": "fillBobFromJSON → C_ORDERLINE.INGREDIENTSARRAY"
  }
];

var DATA_DISCOUNTS = [
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "DISCOUNT",
    "path": "data.ticket.discountengine.lines[].discounts[].amt",
    "name": "amt",
    "type": "number",
    "description": "Alternative field name for the discount amount. Accepted as fallback for obdiscAmt.",
    "howItWorks": "Code reads: discount.obdiscAmt || discount.amt. If obdiscAmt is not provided, amt is used instead.",
    "codeRef": "TicketUtils.js L668"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "DISCOUNT",
    "path": "data.ticket.discountengine.lines[].discounts[].promotionLineId",
    "name": "promotionLineId",
    "type": "string",
    "description": "Promotion line ID used to identify a specific discount instance.",
    "howItWorks": "Code reads: discount.promotionLineId || discount.discountinstance. Used to match discount instances across calls and to retain OB discount percentages.",
    "codeRef": "TicketUtils.js L616"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "DISCOUNT",
    "path": "data.ticket.discountengine.lines[].discounts[].discountinstance",
    "name": "discountinstance",
    "type": "string",
    "description": "Alternative field name for promotionLineId. Identifies a specific discount instance.",
    "howItWorks": "Fallback for promotionLineId: discount.promotionLineId || discount.discountinstance.",
    "codeRef": "TicketUtils.js L616"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "DISCOUNT",
    "path": "data.ticket.discountengine.lines[].discounts[].applyMethod",
    "name": "applyMethod",
    "type": "string",
    "description": "Discount application method (e.g. automatic, discretionary).",
    "howItWorks": "Code reads: discount.applyMethod || baseDiscount.obdiscApplicationmethod. If not sent, the base discount's method is used.",
    "codeRef": "TicketUtils.js L667"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "MANUAL_PROMO",
    "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].promotionLineId",
    "name": "promotionLineId",
    "type": "string",
    "description": "Promotion line ID for manual discounts. Mapped to discountinstance internally.",
    "howItWorks": "Code maps: discountinstance: m.promotionLineId. Used to identify the specific instance of the discount.",
    "codeRef": "TicketUtils.js L700-703"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "BYTOTAL_PROMO",
    "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].promotionLineId",
    "name": "promotionLineId",
    "type": "string",
    "description": "Promotion line ID for by-total discounts. Mapped to discountinstance internally.",
    "howItWorks": "Code maps: discountinstance: m.promotionLineId. Used to identify the specific instance of the discount.",
    "codeRef": "TicketUtils.js L714-716"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "BYTOTAL_PROMO",
    "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].applyNext",
    "name": "applyNext",
    "type": "boolean",
    "description": "Indicates whether the next discount in the chain should also be applied.",
    "howItWorks": "Read in cdiscUtils.js when building the promotionToApply rule object: applyNext: bytotalManualPromotion.applyNext.",
    "codeRef": "cdiscUtils.js L68"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "BYTOTAL_PROMO",
    "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].obdiscAllowmultipleinstan",
    "name": "obdiscAllowmultipleinstan",
    "type": "boolean",
    "description": "Indicates whether multiple instances of this discount are allowed.",
    "howItWorks": "Read in cdiscUtils.js when building the promotionToApply rule object: obdiscAllowmultipleinstan: bytotalManualPromotion.obdiscAllowmultipleinstan.",
    "codeRef": "cdiscUtils.js L71"
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "direction": "Response",
    "level": "BYTOTAL_PROMO",
    "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].searchKey",
    "name": "searchKey",
    "type": "string",
    "description": "Search key of the by-total discount. Used to filter duplicates.",
    "howItWorks": "Used in generateOBDiscounts() to filter: !manualPromotions.some(p => p.searchKey === m.searchKey). Present in request schema but MISSING from response schema.",
    "codeRef": "TicketUtils.js L710"
  }
];
