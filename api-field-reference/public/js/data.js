window.DATA_ORDERS = [
  {
    "endpoint": "LOGIN",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "✅ Action name (enum: LOGIN)<br><span class=\"desc-code\">Fixed value 'LOGIN'. Defined in ExternalOrdersUtils.js → getExternalOrdersConfigurationAction(). Assigned in buildRequest() to the payload.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "terminal",
        "path": "terminal",
        "type": "object",
        "desc": "✅ Common terminal object (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Terminal object built with OB.EVTCLI.createTerminalObject(terminal, context, {}). Contains terminal and context info.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "serviceId",
        "path": "serviceId",
        "type": "string",
        "desc": "✅ Common service ID (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Random 10-digit ID generated with crypto.getRandomValues(). Uniquely identifies each call.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains additional information of the request<br><span class=\"desc-code\">Request data object. For LOGIN it is sent empty (no additional payload).</span>",
        "severity": "✅ OK"
      }
    ]
  },
  {
    "endpoint": "LOGIN",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "label",
            "path": "data.label",
            "type": "string",
            "desc": "✅ Title of the External Order service<br><span class=\"desc-code\">Title of the External Orders service. Displayed in the UI as the identifier of the connected external service.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "version",
            "path": "data.version",
            "type": "string",
            "desc": "✅ Version number of the External Order service<br><span class=\"desc-code\">Version number of the external service. Informative.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "filters",
            "path": "data.filters",
            "type": "array",
            "desc": "✅ List with the definition of the external orders filters.<br><span class=\"desc-code\">Array of filter definitions for external order search. Used in the UI to render the search form. Each filter defines field, label, type, and optionally mandatory and scanFilter.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "field",
                "path": "data.filters[].field",
                "type": "string",
                "desc": "✅ Identifier of the filter field. Used in the search request.<br><span class=\"desc-code\">Filter field identifier. Sent as field in the filters array of the SEARCH request to identify which filter is being applied.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "label",
                "path": "data.filters[].label",
                "type": "string",
                "desc": "✅ Label to be displayed in the filter dialog to the cashier. It is an internationalized value.<br><span class=\"desc-code\">Label displayed to the cashier in the filter dialog. Internationalized value.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "type",
                "path": "data.filters[].type",
                "type": "string",
                "desc": "✅ Filter fixed value type (enum: string, date, customerFilter)<br><span class=\"desc-code\">Filter type. Determines the UI component that is rendered: 'string' = text field, 'date' = date picker, 'customerFilter' = customer (BP) selector.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "mandatory",
                "path": "data.filters[].mandatory",
                "type": "boolean",
                "desc": "✅ Whether this filter value is mandatory to be filled in or not. By default it won't be mandatory<br><span class=\"desc-code\">Indicates if the filter is mandatory. Default false. In the simulator only externalBusinessPartnerReference is mandatory: true.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "scanFilter",
                "path": "data.filters[].scanFilter",
                "type": "boolean",
                "desc": "✅ Whether this filter is used for scanning an external order.<br><span class=\"desc-code\">Indicates if this filter is used for scanning an external order (barcode reading). In the simulator only documentNo has scanFilter: true.</span>",
                "severity": "✅ OK"
              }
            ]
          },
          {
            "name": "columns",
            "path": "data.columns",
            "type": "array",
            "desc": "✅ List with the definition of external orders headers used to display the dataset returned by the search filter<br><span class=\"desc-code\">Array of column definitions for the search results table. Defines which order fields are displayed and how.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "field",
                "path": "data.columns[].field",
                "type": "string",
                "desc": "✅ Identifier of the order field.<br><span class=\"desc-code\">Order field identifier. Must match the keys of the values object of each order in the SEARCH response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "label",
                "path": "data.columns[].label",
                "type": "string",
                "desc": "ℹ️ Label to be displayed in the header of the orders dataset returned by the search filter.<br><span class=\"desc-code\">Column header label in the results table. NOTE: in the schema it is defined as 'label' but in the simulator and in the main YML example 'headerName' is used instead of 'label'.</span>",
                "severity": "ℹ️ MEJORABLE"
              },
              {
                "name": "type",
                "path": "data.columns[].type",
                "type": "string",
                "desc": "✅ Filter fixed value type (enum: string, date)<br><span class=\"desc-code\">Column data type. Determines the display format in the table.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "sortable",
                "path": "data.columns[].sortable",
                "type": "boolean",
                "desc": "✅ Allows sorting the search result by the values stored in this column. Default is false.<br><span class=\"desc-code\">Allows sorting search results by this column. Default false. In the simulator only documentNo has sortable: true.</span>",
                "severity": "✅ OK"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "endpoint": "SEARCH",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "✅ Fixed value for the present request (enum: SEARCH)<br><span class=\"desc-code\">Fixed value 'SEARCH'. Defined in ExternalOrdersUtils.js → getExternalOrdersListAction().</span>",
        "severity": "✅ OK"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "filters",
            "path": "data.filters",
            "type": "array",
            "desc": "✅ List with the search values of the orders to load based on the applied filters in the query<br><span class=\"desc-code\">Array of filters with the values entered by the cashier. Each element has field (identifier) and value (searched value). Passed directly from the UI.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "field",
                "path": "data.filters[].field",
                "type": "string",
                "desc": "✅ Identifier of the order field<br><span class=\"desc-code\">Filter field identifier. Matches the field defined in the LOGIN response filters. Used in the simulator to look up the corresponding value in each order.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "value",
                "path": "data.filters[].value",
                "type": "string",
                "desc": "✅ Filled value for the filter to be applied on search query<br><span class=\"desc-code\">Value entered by the cashier for this filter. Used in the simulator for case-insensitive matching with includes().</span>",
                "severity": "✅ OK"
              }
            ]
          },
          {
            "name": "offset",
            "path": "data.offset",
            "type": "number",
            "desc": "ℹ️ Indicates the starting record of the dataset result of the filter query. It will be used to implement pagination. TO BE DEFINED if the offset is zero based or one based<br><span class=\"desc-code\">Offset for pagination. Passed from GetExternalOrdersList.js as the second argument. NOTE: the YML says 'TO BE DEFINED if the offset is zero based or one based' — still undefined.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "limit",
            "path": "data.limit",
            "type": "number",
            "desc": "ℹ️ Indicates the limit of records returned of the dataset result of the filter query. It will be used to implement pagination or to prevent loading a big dataset of orders.<br><span class=\"desc-code\">Record limit for pagination. Passed from GetExternalOrdersList.js as the third argument. The simulator does not implement it.</span>",
            "severity": "ℹ️ MEJORABLE"
          }
        ]
      }
    ]
  },
  {
    "endpoint": "SEARCH",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "offset",
            "path": "data.offset",
            "type": "number",
            "desc": "✅ The offset of the orders list returned by this search request<br><span class=\"desc-code\">Offset returned in the search response. Allows the client to know from which record the returned dataset starts.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "orders",
            "path": "data.orders",
            "type": "array",
            "desc": "✅ The list of orders returned by the search request. The model of each order record matches the definition of the data.headers definition returned in the LOGIN response.<br><span class=\"desc-code\">Array of found orders. Each order has orderID and values. The simulator filters ordersInfo according to the received filters.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "orderID",
                "path": "data.orders[].orderID",
                "type": "string",
                "desc": "✅ Identifier of the order<br><span class=\"desc-code\">Unique identifier of the order in the external system. Used later in LOAD to load the order details.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "values",
                "path": "data.orders[].values",
                "type": "object",
                "desc": "✅ Contains the details of the order matching the headers definition from the LOGIN response<br><span class=\"desc-code\">Object with the order values. The keys must match the field defined in columns of the LOGIN response (documentNo, businessPartner, date, etc.).</span>",
                "severity": "✅ OK"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "endpoint": "LOAD",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "✅ Fixed value for the present request (enum: LOAD)<br><span class=\"desc-code\">Fixed value 'LOAD'. Defined in ExternalOrdersUtils.js → getExternalOrdersTicketAction().</span>",
        "severity": "✅ OK"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "orderID",
            "path": "data.orderID",
            "type": "string",
            "desc": "✅ Order identifier of the order to be loaded<br><span class=\"desc-code\">ID of the external order to load. Obtained from the orderID selected in the SEARCH results list.</span>",
            "severity": "✅ OK"
          }
        ]
      }
    ]
  },
  {
    "endpoint": "LOAD",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "orderDate",
            "path": "data.orderDate",
            "type": "string (date)",
            "desc": "✅ Date of the order. Optional<br><span class=\"desc-code\">Order date. Optional. In addBasicProperties() if it does not come, new Date().toISOString() is assigned as default.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "orderID",
            "path": "data.orderID",
            "type": "string",
            "desc": "✅ Order identifier at the external system<br><span class=\"desc-code\">Order ID in the external system. Preserved in the ticket and used later in COMMIT to identify the order. Also used as fallback for obpos2Entryvalue in the lines.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "documentNo",
            "path": "data.documentNo",
            "type": "string",
            "desc": "✅ Document number to be assigned. Optional<br><span class=\"desc-code\">Document number to assign to the order. Optional. Used as the first fallback for obpos2Entryvalue in the lines.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "grossAmount",
            "path": "data.grossAmount",
            "type": "number",
            "desc": "ℹ️ Gross amount of the ticket. Not used, recalculated<br><span class=\"desc-code\">Total gross amount of the ticket. The YML itself indicates it is not used and is recalculated. Sent in the simulator but not processed in LoadExternalOrdersTicket.js.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "netAmount",
            "path": "data.netAmount",
            "type": "number",
            "desc": "ℹ️ Net amount of the ticket. Not used, recalculated<br><span class=\"desc-code\">Total net amount of the ticket. The YML itself indicates it is not used and is recalculated. Sent in the simulator but not processed in LoadExternalOrdersTicket.js.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "externalBusinessPartnerReference",
            "path": "data.externalBusinessPartnerReference",
            "type": "string",
            "desc": "✅ Reference id to an External Business Partner. Optional<br><span class=\"desc-code\">External Business Partner reference. Used in addExternalBusinessPartnerInfoToTicket() to associate the BP to the ticket and in the post-hook of loadExternalOrdersTicket.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "warehouseSearchKey",
            "path": "data.warehouseSearchKey",
            "type": "string",
            "desc": "✅ Reference to the warehouseSearchKey<br><span class=\"desc-code\">Warehouse search key. Used in addWarehouseToTicketAndLines() to look up the warehouse in the terminal's warehouse list and assign it to the ticket and its lines.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "priceIncludesTaxes",
            "path": "data.priceIncludesTaxes",
            "type": "boolean",
            "desc": "✅ Indicates if taxes are included in the price<br><span class=\"desc-code\">Indicates if prices include taxes. NOTE: in the schema it is called 'priceIncludesTaxes' (plural) but in the simulator and in addBasicProperties() 'priceIncludesTax' (singular) is used. addBasicProperties() overwrites with pricelist.priceIncludesTax from the terminal.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "obposOldPrepaymentamt",
            "path": "data.obposOldPrepaymentamt",
            "type": "number",
            "desc": "✅ Value to define the prepayment amount for the ticket. Optional<br><span class=\"desc-code\">Ticket prepayment amount. Preserved in the ticket as-is from the response. Not transformed in LoadExternalOrdersTicket.js.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "isQuotation",
            "path": "data.isQuotation",
            "type": "boolean",
            "desc": "✅ Informs if the order must be considered as a quotation<br><span class=\"desc-code\">Indicates if the order is a quotation. In addBasicProperties() it is normalized with !!newTicket.isQuotation (converts to strict boolean).</span>",
            "severity": "✅ OK"
          },
          {
            "name": "documentType",
            "path": "data.documentType",
            "type": "string",
            "desc": "✅ Reference id to a document type in case of needed. Optional<br><span class=\"desc-code\">Document type ID. Optional. Preserved in the ticket as-is. Only some simulator orders include it.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "generateInvoice",
            "path": "data.generateInvoice",
            "type": "boolean",
            "desc": "✅ Indicates that the invoice will be created<br><span class=\"desc-code\">Indicates that an invoice must be created. Processed in addForceInvoice(): if true and fullInvoice is true a full invoice is generated; if fullInvoice is false and generateSubstitutiveInvoice is true a substitutive invoice is generated. Also assigns obInvoicingAddress and obShippingAddress from the BP.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "fullInvoice",
            "path": "data.fullInvoice",
            "type": "boolean",
            "desc": "✅ Indicates that the invoice created will be a full Invoice. If the fullInvoice and generateInvoice flags are set to true, the generated invoice will be a full Invoice. If the fullInvoice flag is set to false and the generateInvoice and generateSubstitutiveInvoice flags are set to true, the generated invoice will be a Substitutive Invoice.<br><span class=\"desc-code\">Indicates full invoice. In addForceInvoice(): if generateInvoice=true and fullInvoice=true, generateSubstitutiveInvoice is removed. If generateInvoice=false, fullInvoice is removed.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "generateSubstitutiveInvoice",
            "path": "data.generateSubstitutiveInvoice",
            "type": "boolean",
            "desc": "✅ Indicates that the invoice created will be a Substitutive Invoice. Check the fullInvoice description in order to know which combination of flags will make the generated invoice a Substitutive Invoice.<br><span class=\"desc-code\">Indicates substitutive invoice. In addForceInvoice(): if generateInvoice=true and fullInvoice=false and generateSubstitutiveInvoice=true, fullInvoice is removed. If generateInvoice=false it is removed.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "isEditable",
            "path": "data.isEditable",
            "type": "boolean",
            "desc": "✅ This field indicates whether the order is editable<br><span class=\"desc-code\">Indicates if the order is editable. In addBasicProperties() it is used with default true: const { isEditable = true } = newTicket. Propagated to the ticket.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "allowAddProduct",
            "path": "data.allowAddProduct",
            "type": "boolean",
            "desc": "✅ Indicates that a new product can be added<br><span class=\"desc-code\">Indicates if new products can be added to the order. In addPermissionPropertiesToTicketAndLines() it is used with default true: const { allowAddProduct = true } = newTicket.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "isCustomerUneditable",
            "path": "data.isCustomerUneditable",
            "type": "boolean",
            "desc": "✅ This field indicates whether the customer is non-editable<br><span class=\"desc-code\">Indicates if the customer cannot be changed. Preserved in the ticket as-is. Not transformed in LoadExternalOrdersTicket.js.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "isReturn",
            "path": "data.isReturn",
            "type": "boolean",
            "desc": "✅ Indicates if the document is a return or not inside sales or purchase flow.<br><span class=\"desc-code\">Indicates if the document is a return. Preserved in the ticket as-is. No simulator order uses it.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "lines",
            "path": "data.lines",
            "type": "array",
            "desc": "✅ Array containing the list of items<br><span class=\"desc-code\">Array of order lines. Processed sequentially in formatExternalTicket(): addBasicProperties() generates IDs, addProductToLines() resolves products by searchKey, addTaxesToTicketAndLines() resolves taxes.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "product",
                "path": "data.lines[].product",
                "type": "string",
                "desc": "✅ Product searchKey<br><span class=\"desc-code\">Product search key. In addProductToLines() it is used to look up the product in MasterdataModels.Product with criteria.criterion('searchkey', line.product). If not found it throws EXO_OrderData_Error.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "lineNo",
                "path": "data.lines[].lineNo",
                "type": "string",
                "desc": "✅ Line number. Optional<br><span class=\"desc-code\">Line number. Optional. Preserved in the line as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "qty",
                "path": "data.lines[].qty",
                "type": "number",
                "desc": "✅ Quantity of the product<br><span class=\"desc-code\">Product quantity in the line. Preserved as-is and used in the final ticket.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossAmount",
                "path": "data.lines[].grossAmount",
                "type": "number",
                "desc": "✅ Final total amount of the line, including taxes, and any potential discounts or price reductions applied (in most cases, it is equivalent to grossUnitPrice*quantity)<br><span class=\"desc-code\">Total gross amount of the line with taxes and discounts applied. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "netAmount",
                "path": "data.lines[].netAmount",
                "type": "number",
                "desc": "✅ Final total amount of the line, excluding taxes, but with any potential discounts or price reductions applied (in most cases, it is equivalent to netUnitPrice*quantity)<br><span class=\"desc-code\">Total net amount of the line without taxes but with discounts applied. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossUnitPrice",
                "path": "data.lines[].grossUnitPrice",
                "type": "number",
                "desc": "✅ Final price of the product in the line, including taxes. It is based on the final price set by the user, and includes all discounts and promotions.<br><span class=\"desc-code\">Final gross unit price with taxes, including discounts and promotions. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "netUnitPrice",
                "path": "data.lines[].netUnitPrice",
                "type": "number",
                "desc": "✅ Final price of the product in the line, excluding taxes. It is based on the final price set by the user, and includes all discounts and promotions, but does not include taxes.<br><span class=\"desc-code\">Final net unit price without taxes, including discounts and promotions. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossListPrice",
                "path": "data.lines[].grossListPrice",
                "type": "number",
                "desc": "✅ Initially listed price of the product in the line, including taxes. It does not include any potential reduction in the price by the user or any discounts. It does include taxes.<br><span class=\"desc-code\">Original gross list price with taxes, without discounts or user price reductions. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "netListPrice",
                "path": "data.lines[].netListPrice",
                "type": "number",
                "desc": "✅ Initially listed price of the product in the line, excluding taxes. It does not include any potential reduction in the price by the user or any discounts, or any taxes that might apply.<br><span class=\"desc-code\">Original net list price without taxes or discounts. Preserved as-is from the response. NOTE: not in the schema's required but used in the simulator.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "id",
                "path": "data.lines[].id",
                "type": "string",
                "desc": "✅ Id of the line. Optional<br><span class=\"desc-code\">Line ID. Optional. If it does not come from the response, addBasicProperties() generates one with OB.App.UUID.generate(). If it comes, it is preserved.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "netUnitAmount",
                "path": "data.lines[].netUnitAmount",
                "type": "number",
                "desc": "✅ Same as netAmount (can be specified instead)<br><span class=\"desc-code\">Equivalent to netAmount. Can be specified instead. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "priceIncludesTax",
                "path": "data.lines[].priceIncludesTax",
                "type": "boolean",
                "desc": "✅ Indicates if taxes are included in the price<br><span class=\"desc-code\">Indicates if the prices of this line include taxes. Preserved at line level. Note that it also exists at ticket level (priceIncludesTaxes in schema, priceIncludesTax in code).</span>",
                "severity": "✅ OK"
              },
              {
                "name": "isEditable",
                "path": "data.lines[].isEditable",
                "type": "boolean",
                "desc": "✅ This field indicates whether the line is editable<br><span class=\"desc-code\">Indicates if the line is editable. In addBasicProperties() it is normalized: isEditable: line.isEditable !== false (default true). Also conditions skipApplyPromotions.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "baseGrossUnitAmount",
                "path": "data.lines[].baseGrossUnitAmount",
                "type": "number",
                "desc": "✅ Total amount of the line with taxes included, with potentially user-defined price changes also applied, but without discounts applied to the line<br><span class=\"desc-code\">Total amount of the line with taxes and user-defined price changes, but without line discounts. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "baseNetUnitAmount",
                "path": "data.lines[].baseNetUnitAmount",
                "type": "number",
                "desc": "✅ Total amount of the line with potentially user-defined price changes applied, but without either taxes or discounts applied<br><span class=\"desc-code\">Total amount of the line with user-defined price changes, without taxes or discounts. Preserved as-is. In the simulator it is always 0.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "baseGrossUnitPrice",
                "path": "data.lines[].baseGrossUnitPrice",
                "type": "number",
                "desc": "✅ Price of the product in the line with taxes applied, with potentially user-defined price changes, but without discounts yet applied<br><span class=\"desc-code\">Gross unit price with taxes and user-defined price changes, but without discounts. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossUnitAmount",
                "path": "data.lines[].grossUnitAmount",
                "type": "number",
                "desc": "✅ Same as grossAmount (can be specified instead)<br><span class=\"desc-code\">Equivalent to grossAmount. Can be specified instead. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossUnitAmountWithoutTicketDiscounts",
                "path": "data.lines[].grossUnitAmountWithoutTicketDiscounts",
                "type": "number",
                "desc": "✅ Total amount of the line with taxes and without discounts. Optional<br><span class=\"desc-code\">Total amount of the line with taxes but without ticket discounts. Optional. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossUnitPriceWithoutTicketDiscounts",
                "path": "data.lines[].grossUnitPriceWithoutTicketDiscounts",
                "type": "number",
                "desc": "✅ Price of the product in the line with taxes applied and without discounts. Optional<br><span class=\"desc-code\">Gross unit price with taxes but without ticket discounts. Optional. Preserved as-is from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "deliveryMethod",
                "path": "data.lines[].deliveryMethod",
                "type": "string",
                "desc": "✅ Delivery method enum: PickAndCarry, PickupInStore, PickupInStoreDate, HomeDelivery, HomeDeliveryDate<br><span class=\"desc-code\">Delivery method. In addSchemaToTicketAndLines() it is used as fallback of the schema's deliveryMode: const { deliveryMethod = deliveryMode } = line. Mapped to obrdmDeliveryMode. If it is PickupInStoreDate or HomeDeliveryDate it also assigns obrdmDeliveryDate/Time.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "deliveryMethodDate",
                "path": "data.lines[].deliveryMethodDate",
                "type": "string (date)",
                "desc": "✅ Date and Time string in ISO Format.<br><span class=\"desc-code\">Delivery date and time in ISO format. Used in getDeliveryModeForLine() to assign obrdmDeliveryDate and obrdmDeliveryTime when the deliveryMethod is PickupInStoreDate or HomeDeliveryDate.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "taxCategory",
                "path": "data.lines[].taxCategory",
                "type": "string",
                "desc": "✅ Tax Category Name<br><span class=\"desc-code\">Tax category name. Preserved in the line. Not transformed in LoadExternalOrdersTicket.js; taxes are resolved by searchKey in taxes[], not by taxCategory.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "isDeletable",
                "path": "data.lines[].isDeletable",
                "type": "boolean",
                "desc": "✅ This field indicates whether the line is deletable<br><span class=\"desc-code\">Indicates if the line can be deleted. NOTE: in the schema it is called 'isDeletable' but in addPermissionPropertiesToTicketAndLines() 'allowProductDeletion' is used (with default true). The simulator sends both fields in some lines.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "allowModifyProductQuantity",
                "path": "data.lines[].allowModifyProductQuantity",
                "type": "boolean",
                "desc": "✅ This field indicates whether the quantity of the product can be modified<br><span class=\"desc-code\">Indicates if the product quantity can be modified. In addPermissionPropertiesToTicketAndLines() it is used with default true: const { allowModifyProductQuantity = true } = line.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "taxes",
                "path": "data.lines[].taxes",
                "type": "array",
                "desc": "✅ Array of taxes applicable to the line<br><span class=\"desc-code\">Array of taxes applicable to the line. Processed in addTaxesToTicketAndLines(): each tax is resolved by looking up its searchKey in OB.Taxes.Pos.ruleImpls to obtain id, name, cascade, taxBase. If not found it throws EXO_OrderData_Error.</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "searchKey",
                    "path": "data.lines[].taxes[].searchKey",
                    "type": "string",
                    "desc": "✅ Tax search key<br><span class=\"desc-code\">Tax search key. Used to look up the tax rule in OB.Taxes.Pos.ruleImpls. It is the key field for resolving the tax.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "rate",
                    "path": "data.lines[].taxes[].rate",
                    "type": "number",
                    "desc": "✅ Tax rate<br><span class=\"desc-code\">Tax rate. Preserved from the response and included in the line's tax object. The first tax of the line is assigned as firstTaxRate.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "net",
                    "path": "data.lines[].taxes[].net",
                    "type": "number",
                    "desc": "✅ Taxable amount<br><span class=\"desc-code\">Taxable amount (net amount on which the tax is calculated). Preserved from the response.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "amount",
                    "path": "data.lines[].taxes[].amount",
                    "type": "number",
                    "desc": "✅ Tax amount<br><span class=\"desc-code\">Tax amount. Preserved from the response.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "docTaxAmount",
                    "path": "data.lines[].taxes[].docTaxAmount",
                    "type": "string",
                    "desc": "✅ 'D' if tax is calculated at document level, 'L' if calculated at line level (enum: D, L)<br><span class=\"desc-code\">Indicates if the tax is calculated at document level ('D') or line level ('L'). Preserved from the response.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "lineNo",
                    "path": "data.lines[].taxes[].lineNo",
                    "type": "string",
                    "desc": "✅ Tax line number. Optional<br><span class=\"desc-code\">Tax line number. Optional. Preserved from the response.</span>",
                    "severity": "✅ OK"
                  }
                ]
              }
            ]
          },
          {
            "name": "taxes",
            "path": "data.taxes",
            "type": "array",
            "desc": "✅ Array of taxes applicable to the ticket<br><span class=\"desc-code\">Array of taxes at ticket level. Processed in addTaxesToTicketAndLines() similarly to line taxes: each tax is looked up by searchKey in OB.Taxes.Pos.ruleImpls and enriched with name, cascade, id, taxBase. Converted from array to indexed object.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "searchKey",
                "path": "data.taxes[].searchKey",
                "type": "string",
                "desc": "✅ Tax search key<br><span class=\"desc-code\">Tax search key at ticket level. Used to look up the rule in OB.Taxes.Pos.ruleImpls same as in lines.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "rate",
                "path": "data.taxes[].rate",
                "type": "number",
                "desc": "✅ Tax rate<br><span class=\"desc-code\">Tax rate at ticket level. Preserved from the response and enriched with OB rule data.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "net",
                "path": "data.taxes[].net",
                "type": "number",
                "desc": "✅ Taxable amount<br><span class=\"desc-code\">Taxable amount at ticket level. Preserved from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "amount",
                "path": "data.taxes[].amount",
                "type": "number",
                "desc": "✅ Tax amount<br><span class=\"desc-code\">Tax amount at ticket level. Preserved from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "docTaxAmount",
                "path": "data.taxes[].docTaxAmount",
                "type": "string",
                "desc": "✅ 'D' if tax is calculated at document level, 'L' if calculated at line level (enum: D, L)<br><span class=\"desc-code\">Indicates if the tax is calculated at document or line level. Preserved from the response.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "lineNo",
                "path": "data.taxes[].lineNo",
                "type": "string",
                "desc": "✅ Tax line number. Optional<br><span class=\"desc-code\">Tax line number at ticket level. Optional. Preserved from the response.</span>",
                "severity": "✅ OK"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "endpoint": "COMMIT",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "✅ Action name (enum: COMMIT)<br><span class=\"desc-code\">Fixed value 'COMMIT'. Defined in ExternalOrdersUtils.js → getExternalOrdersCommitAction().</span>",
        "severity": "✅ OK"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "orderID",
            "path": "data.orderID",
            "type": "string",
            "desc": "✅ Order identifier of the order to be loaded from the external system<br><span class=\"desc-code\">Order ID in the external system. Obtained from Ticket.orderID. In HttpInterceptor.js it is used as path param for REST: externalOrders/${data.orderID}.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "id",
            "path": "data.id",
            "type": "string",
            "desc": "✅ Order identifier of the order to be loaded in Openbravo<br><span class=\"desc-code\">Order ID in Openbravo (UUID generated in addBasicProperties). Obtained from Ticket.id.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "status",
            "path": "data.status",
            "type": "string",
            "desc": "✅ Informs about the action processed for the present order (enum: COMPLETED, DISCARDED)<br><span class=\"desc-code\">Final status of the order. COMPLETED if it was paid and completed, DISCARDED if it was deleted. Conditions the flow in CommitExternalOrderActionPreparation: if DISCARDED, documentNo and paymentDate are not sent. In HttpInterceptor: COMPLETED uses PUT, DISCARDED uses DELETE.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "paymentDate",
            "path": "data.paymentDate",
            "type": "date",
            "desc": "⚠️ Date and time indicating when the order was paid.<br><span class=\"desc-code\">Payment date and time. Generated with OB.Utilities.Date.JSToOB(new Date(), OB.Format.dateTime). Only sent when status is COMPLETED. NOTE: the YML defines type: date but in the example it uses format 'DD-MM-YYYY HH:mm:ss' which is a string, not a standard date type.</span>",
            "severity": "⚠️ ERROR DESC"
          },
          {
            "name": "documentNo",
            "path": "data.documentNo",
            "type": "string",
            "desc": "✅ Calculated order document assigned to the order.<br><span class=\"desc-code\">Calculated document number. Generated with OB.App.State.DocumentSequence.Utils.generateDocumentNumber(). Only sent when status is COMPLETED.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "rollback",
            "path": "data.rollback",
            "type": "boolean",
            "desc": "ℹ️ (Not documented in YML)<br><span class=\"desc-code\">Internal flag that indicates if the commit is a rollback (retry after failure). Not documented in the YML. Conditions the error messages: if rollback=true it uses EXO_CommitRollbackFailure instead of EXO_CommitFailure. Sent in the payload to the external system.</span>",
            "severity": "ℹ️ MEJORABLE"
          }
        ]
      }
    ]
  },
  {
    "endpoint": "COMMIT",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Empty object in response<br><span class=\"desc-code\">Empty data object in the response. COMMIT only needs to report SUCCESS or FAILURE. No additional data is returned.</span>",
        "severity": "✅ OK"
      }
    ]
  }
];

window.DATA_DISCOUNTS = [
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "ℹ️ Action name.<br><span class=\"desc-code\">Fixed value 'CALCULATE_DISCOUNTS'. Identifies the request type to the external discounts system. Defined in TicketUtils.js → getCalculateDiscountsAction().</span>",
        "severity": "ℹ️ MEJORABLE"
      },
      {
        "name": "terminal",
        "path": "terminal",
        "type": "object",
        "desc": "✅ Common terminal object (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Terminal object built in createRequestHeader() with terminal.searchKey, context.user.username, terminal.language_string, terminal.groupBusinessUnitSK, terminal.terminalType.name.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "serviceId",
        "path": "serviceId",
        "type": "string",
        "desc": "✅ Common service ID (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Random 10-digit ID generated with crypto.getRandomValues(). Uniquely identifies each call.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "sessionId",
        "path": "sessionId",
        "type": "string",
        "desc": "ℹ️ Session ID that identifies the current session.<br><span class=\"desc-code\">Session ID extracted from the last external response stored in ticket.cdiscExternalresponse. If there is no previous response it returns null.</span>",
        "severity": "ℹ️ MEJORABLE"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "id",
            "path": "data.id",
            "type": "string",
            "desc": "✅ ID of the Ticket being handled.<br><span class=\"desc-code\">ID of the current ticket. Also used in the response to validate that it matches the current ticket.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "organization",
            "path": "data.organization",
            "type": "object",
            "desc": "✅ Object that contains information of the organization doing the request.<br><span class=\"desc-code\">Object with organization info. Built in createRequestHeader() from context.organization.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.organization.id",
                "type": "string",
                "desc": "✅ Organization ID.<br><span class=\"desc-code\">Organization ID from the terminal context.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "_identifier",
                "path": "data.organization._identifier",
                "type": "string",
                "desc": "✅ Name of the Organization.<br><span class=\"desc-code\">Organization name from the terminal context.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "searchKey",
                "path": "data.organization.searchKey",
                "type": "string",
                "desc": "✅ Searchkey of the Organization.<br><span class=\"desc-code\">Search key of the organization from the terminal context.</span>",
                "severity": "✅ OK"
              }
            ]
          },
          {
            "name": "priceIncludesTax",
            "path": "data.priceIncludesTax",
            "type": "boolean",
            "desc": "ℹ️ Boolean that indicates whether the prices includes taxes or not in the system.<br><span class=\"desc-code\">Indicates whether prices include taxes. Determines which price fields are sent in the lines (gross vs net).</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "externalBusinessPartner",
            "path": "data.externalBusinessPartner",
            "type": "object",
            "desc": "ℹ️ Object that contains the external business partner information.<br><span class=\"desc-code\">Object with external BP information. Free structure (untyped), comes from CRM integrations.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "externalBusinessPartnerReference",
            "path": "data.externalBusinessPartnerReference",
            "type": "string",
            "desc": "✅ Reference ID of the external BP when using CRM Connector.<br><span class=\"desc-code\">External BP reference for CRM Connector.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "lines",
            "path": "data.lines",
            "type": "array",
            "desc": "✅ Array of Objects that represents the lines in the ticket.<br><span class=\"desc-code\">Array of ticket lines. Built in reduceLines() by mapping each line with its product, conditional prices (gross/net), taxes and promotionsFromOBEngine.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.lines[].id",
                "type": "string",
                "desc": "✅ line ID.<br><span class=\"desc-code\">Unique ID of the ticket line. Used in the response to match the returned discounts with the ticket lines.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "product",
                "path": "data.lines[].product",
                "type": "object",
                "desc": "✅ Object containing product related information.<br><span class=\"desc-code\">Object with product info. Built in getProductObject() by mapping internal fields to API names.</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "id",
                    "path": "data.lines[].product.id",
                    "type": "string",
                    "desc": "✅ Product ID.<br><span class=\"desc-code\">Product ID. Obtained from the line's product object.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "_identifier",
                    "path": "data.lines[].product._identifier",
                    "type": "string",
                    "desc": "✅ Product name.<br><span class=\"desc-code\">Product name.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "upc",
                    "path": "data.lines[].product.upc",
                    "type": "string",
                    "desc": "✅ UPC of the product.<br><span class=\"desc-code\">UPC/EAN code of the product. In the code it is mapped from product.uPCEAN (internal name) to 'upc' (API name).</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "searchKey",
                    "path": "data.lines[].product.searchKey",
                    "type": "string",
                    "desc": "ℹ️ Search key of the product.<br><span class=\"desc-code\">Search key of the product. NOTE: it is sent duplicated as 'searchkey' (lowercase) and 'searchKey' (camelCase) for compatibility. The code comments: 'searchKey is duplicated to fix inconsistent naming but avoid to break the API'.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "listPrice",
                    "path": "data.lines[].product.listPrice",
                    "type": "number",
                    "desc": "✅ List Price defined for the product.<br><span class=\"desc-code\">List price of the product.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "standardPrice",
                    "path": "data.lines[].product.standardPrice",
                    "type": "number",
                    "desc": "✅ Standard Price defined for the product.<br><span class=\"desc-code\">Standard price of the product.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "useExtPromotions",
                    "path": "data.lines[].product.useExtPromotions",
                    "type": "boolean",
                    "desc": "✅ Indicates if a product is candidate for external promotions. It is an informative field and only valid if an external system has filled it. Otherwise it can be ignored.<br><span class=\"desc-code\">Indicates if the product is a candidate for external promotions. Informative field filled by the external system.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "uOM",
                    "path": "data.lines[].product.uOM",
                    "type": "string",
                    "desc": "ℹ️ Unit of Measure of the product.<br><span class=\"desc-code\">Unit of measure of the product. In the code it is mapped from product.uOMname (internal name) to 'uOM' (API name).</span>",
                    "severity": "ℹ️ MEJORABLE"
                  }
                ]
              },
              {
                "name": "qty",
                "path": "data.lines[].qty",
                "type": "number",
                "desc": "ℹ️ Quantity of products in the line.<br><span class=\"desc-code\">Quantity of products in the line. Also used in isValidFlow() to verify that at least one line has qty >= 1 (if there are no positive lines the external system is not called).</span>",
                "severity": "ℹ️ MEJORABLE"
              },
              {
                "name": "baseGrossUnitPrice",
                "path": "data.lines[].baseGrossUnitPrice",
                "type": "number",
                "desc": "✅ If priceIncludesTax = true baseGrossUnitPrice will be received.<br><span class=\"desc-code\">Base gross unit price (with taxes). Only sent if priceIncludesTax is true.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "grossUnitPrice",
                "path": "data.lines[].grossUnitPrice",
                "type": "number",
                "desc": "ℹ️ If priceIncludesTax = true grossUnitPrice will be received.<br><span class=\"desc-code\">Current gross unit price (with taxes and possible discounts already applied). Only sent if priceIncludesTax is true.</span>",
                "severity": "ℹ️ MEJORABLE"
              },
              {
                "name": "baseNetUnitPrice",
                "path": "data.lines[].baseNetUnitPrice",
                "type": "number",
                "desc": "✅ If priceIncludesTax = false baseNetUnitPrice will be received.<br><span class=\"desc-code\">Base net unit price (without taxes). Only sent if priceIncludesTax is false.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "netUnitPrice",
                "path": "data.lines[].netUnitPrice",
                "type": "number",
                "desc": "ℹ️ If priceIncludesTax = false netUnitPrice will be received.<br><span class=\"desc-code\">Current net unit price (without taxes and possible discounts already applied). Only sent if priceIncludesTax is false.</span>",
                "severity": "ℹ️ MEJORABLE"
              },
              {
                "name": "isFirm",
                "path": "data.lines[].isFirm",
                "type": "boolean",
                "desc": "✅ Boolean that indicates if the price is Firm or not (it covers the quotation to sales order flow).<br><span class=\"desc-code\">Indicates if the price is firm. Used in the quotation to sales order flow.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "lineNo",
                "path": "data.lines[].lineNo",
                "type": "number",
                "desc": "ℹ️ Numerical only value assigned to each (it can change between calls).<br><span class=\"desc-code\">Line number. Dynamically calculated as (index + 1) * 10 on each call. NOT copied from the original ticket but recalculated.</span>",
                "severity": "ℹ️ MEJORABLE"
              },
              {
                "name": "taxes",
                "path": "data.lines[].taxes",
                "type": "array",
                "desc": "✅ Array containing the tax information for the line.<br><span class=\"desc-code\">Array of taxes for the line. Built in lineTaxArray() by mapping each tax with id, lineNo, amount, searchKey, name, net, rate, taxBase.</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "id",
                    "path": "data.lines[].taxes[].id",
                    "type": "string",
                    "desc": "✅ Tax ID.<br><span class=\"desc-code\">ID of the tax applied to the line.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "lineNo",
                    "path": "data.lines[].taxes[].lineNo",
                    "type": "number",
                    "desc": "✅ Line number associated with the tax.<br><span class=\"desc-code\">Line number associated with the tax.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "amount",
                    "path": "data.lines[].taxes[].amount",
                    "type": "number",
                    "desc": "✅ Tax amount.<br><span class=\"desc-code\">Tax amount.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "searchKey",
                    "path": "data.lines[].taxes[].searchKey",
                    "type": "string",
                    "desc": "✅ Search key of the tax.<br><span class=\"desc-code\">Search key of the tax.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "name",
                    "path": "data.lines[].taxes[].name",
                    "type": "string",
                    "desc": "✅ Name of the tax.<br><span class=\"desc-code\">Tax name.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "net",
                    "path": "data.lines[].taxes[].net",
                    "type": "number",
                    "desc": "ℹ️ Net amount after tax.<br><span class=\"desc-code\">Net amount of the line for this tax (tax base).</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "rate",
                    "path": "data.lines[].taxes[].rate",
                    "type": "number",
                    "desc": "✅ Tax rate percentage.<br><span class=\"desc-code\">Tax rate percentage.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "taxBase",
                    "path": "data.lines[].taxes[].taxBase",
                    "type": "number",
                    "desc": "✅ Base amount for tax calculation.<br><span class=\"desc-code\">Base amount for tax calculation.</span>",
                    "severity": "✅ OK"
                  }
                ]
              },
              {
                "name": "promotionsFromOBEngine",
                "path": "data.lines[].promotionsFromOBEngine",
                "type": "array",
                "desc": "✅ Array containing the information of the discounts calculated in the OB Discount engine<br><span class=\"desc-code\">Array of discounts calculated by the OB engine. Built in reduceLines() by searching each line in discountsFromOB and mapping its discounts with getDiscountBySearchKey() to resolve the discountTypeSearchKey.</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "id",
                    "path": "data.lines[].promotionsFromOBEngine[].id",
                    "type": "string",
                    "desc": "🔴 Discount ID.<br><span class=\"desc-code\">ID of the discount rule (ruleId). Mapped from d.ruleId of the OB engine, not from d.id.</span>",
                    "severity": "🔴 BUG"
                  },
                  {
                    "name": "searchKey",
                    "path": "data.lines[].promotionsFromOBEngine[].searchKey",
                    "type": "string",
                    "desc": "ℹ️ Search key of the discount.<br><span class=\"desc-code\">Search key of the discount. Used to look up the discount rule in the POS (getDiscountBySearchKey) and obtain the discountTypeSearchKey.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "name",
                    "path": "data.lines[].promotionsFromOBEngine[].name",
                    "type": "string",
                    "desc": "✅ Name of the discount.<br><span class=\"desc-code\">Discount name calculated by the OB engine.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "discountType",
                    "path": "data.lines[].promotionsFromOBEngine[].discountType",
                    "type": "string",
                    "desc": "✅ Search key of the discount type.<br><span class=\"desc-code\">Discount type. Copied directly from d.discountType of the OB engine.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "value",
                    "path": "data.lines[].promotionsFromOBEngine[].value",
                    "type": "string",
                    "desc": "ℹ️ Identifier of the discount type.<br><span class=\"desc-code\">Search key of the discount type resolved from the POS rule. Obtained by looking up the rule by searchKey and extracting discountRule.discountTypeSearchKey. If not found it remains undefined.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "applyMethod",
                    "path": "data.lines[].promotionsFromOBEngine[].applyMethod",
                    "type": "string",
                    "desc": "ℹ️ Discount application method like automatic or discretionary.<br><span class=\"desc-code\">Discount application method (e.g.: 'automatic', 'discretionary', 'optional').</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "amount",
                    "path": "data.lines[].promotionsFromOBEngine[].amount",
                    "type": "number",
                    "desc": "ℹ️ Discount amount.<br><span class=\"desc-code\">Discount amount. Mapped from d.amt (OB engine internal name) to 'amount' (API name).</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "percentage",
                    "path": "data.lines[].promotionsFromOBEngine[].percentage",
                    "type": "number",
                    "desc": "ℹ️ Discount percentage applicable for percentage discounts.<br><span class=\"desc-code\">Discount percentage. Mapped from d.discountPercentage. If it does not exist it remains undefined.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "unitDiscount",
                    "path": "data.lines[].promotionsFromOBEngine[].unitDiscount",
                    "type": "number",
                    "desc": "✅ Discount amount per quantity unit.<br><span class=\"desc-code\">Discount amount per quantity unit.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "isTotalDiscount",
                    "path": "data.lines[].promotionsFromOBEngine[].isTotalDiscount",
                    "type": "boolean",
                    "desc": "ℹ️ Identifies if the discount is part of the total discounts.<br><span class=\"desc-code\">Indicates if the discount is of 'by total' type. Mapped from d.byTotal. If it does not exist it remains undefined.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  }
                ]
              }
            ]
          },
          {
            "name": "discountsFromUser",
            "path": "data.discountsFromUser",
            "type": "object",
            "desc": "✅ Object containing the information of the current discounts in the ticket and/or discounts that are proposed to be applied.<br><span class=\"desc-code\">Object with the current discounts of the ticket plus the proposed candidate discounts. Built in addCandidateDiscounts() by combining existing externalManualPromotions + new candidateDiscounts.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "bytotalManualPromotions",
                "path": "data.discountsFromUser.bytotalManualPromotions",
                "type": "array",
                "desc": "🔴 Array of Objects that represents the lines in the ticket.<br><span class=\"desc-code\">Array of manual discounts of 'by total' type (FixedPerTotal, FixedPercentagePerTotal, VariableDiscountPerTotal, VariablePercentagePerTotal). Built in addCandidateDiscounts() by filtering with isByTotalDiscountTypeBySearchKey().</span>",
                "severity": "🔴 BUG",
                "children": [
                  {
                    "name": "id",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].id",
                    "type": "string",
                    "desc": "✅ Discount ID.<br><span class=\"desc-code\">Discount/promotion ID.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "searchKey",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].searchKey",
                    "type": "string",
                    "desc": "✅ Search key of the discount.<br><span class=\"desc-code\">Search key of the discount.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "name",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].name",
                    "type": "string",
                    "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">Discount name. Displayed in the UI.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "discountType",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].discountType",
                    "type": "string",
                    "desc": "✅ ID of the discount type.<br><span class=\"desc-code\">ID of the discount type.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "value",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].value",
                    "type": "string",
                    "desc": "ℹ️ Identifier of the discount type.<br><span class=\"desc-code\">Search key of the discount type (discountTypeSearchKey). E.g.: 'OBDISC_FixedPerTotal', 'OBDISC_VariableDiscountPerTotal', etc. Used to classify the discount as byTotal or manual.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "disctTotalamountdisc",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].disctTotalamountdisc",
                    "type": "string",
                    "desc": "✅ Amount of the discount if the discount type is Fixed Per Total or Variable Discount Per Total. Null or undefined otherwise.<br><span class=\"desc-code\">Discount amount for FixedPerTotal or VariableDiscountPerTotal types. Assigned in pre-apply-discount.js when the cashier enters an amount. Used in cdiscUtils.js as userAmt.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "disctTotalpercdisc",
                    "path": "data.discountsFromUser.bytotalManualPromotions[].disctTotalpercdisc",
                    "type": "string",
                    "desc": "⚠️ Amount of the discount if the discount type is Fixed Percentage Per Total or Variable Percentage Per Total. Null or undefined otherwise.<br><span class=\"desc-code\">Discount percentage for FixedPercentagePerTotal or VariablePercentagePerTotal types. Takes priority over disctTotalamountdisc in cdiscUtils.js.</span>",
                    "severity": "⚠️ ERROR DESC"
                  }
                ]
              },
              {
                "name": "manualPromotions",
                "path": "data.discountsFromUser.manualPromotions",
                "type": "array",
                "desc": "ℹ️ Array containing the information of the discounts applied to lines.<br><span class=\"desc-code\">Array of manual discounts applied to specific lines (DiscretionaryFixedAmount, UserDefinedAmount, DiscretionaryFixedPercentage, UserDefinedPercentage, UserDefinedLineAmount). Built in addCandidateDiscounts() by filtering with isManualDiscountTypeBySearchKey().</span>",
                "severity": "ℹ️ MEJORABLE",
                "children": [
                  {
                    "name": "id",
                    "path": "data.discountsFromUser.manualPromotions[].id",
                    "type": "string",
                    "desc": "✅ Discount ID.<br><span class=\"desc-code\">Discount/promotion ID.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "searchKey",
                    "path": "data.discountsFromUser.manualPromotions[].searchKey",
                    "type": "string",
                    "desc": "✅ Search key of the discount.<br><span class=\"desc-code\">Search key del descuento.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "name",
                    "path": "data.discountsFromUser.manualPromotions[].name",
                    "type": "string",
                    "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">Nombre del descuento. Se muestra en la UI.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "discountType",
                    "path": "data.discountsFromUser.manualPromotions[].discountType",
                    "type": "string",
                    "desc": "✅ ID of the discount type.<br><span class=\"desc-code\">ID del tipo de descuento.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "value",
                    "path": "data.discountsFromUser.manualPromotions[].value",
                    "type": "string",
                    "desc": "ℹ️ Identifier of the discount type.<br><span class=\"desc-code\">Search key del tipo de descuento (discountTypeSearchKey). Ej: 'OBDISC_DiscretionaryFixedAmount', 'OBDISC_UserDefinedPercentage', etc.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "obdiscAmt",
                    "path": "data.discountsFromUser.manualPromotions[].obdiscAmt",
                    "type": "number",
                    "desc": "✅ Amount of the discount if the discount type is Discretionary Fixed Amount or User Defined Amount. Null or undefined otherwise.<br><span class=\"desc-code\">Importe fijo del descuento para tipos DiscretionaryFixedAmount o UserDefinedAmount. Se asigna en pre-apply-discount.js cuando el cajero introduce un importe.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "obdiscPercentage",
                    "path": "data.discountsFromUser.manualPromotions[].obdiscPercentage",
                    "type": "number",
                    "desc": "⚠️ Amount of the discount if the discount type is Discretionary Fixed Percentage or User Defined Percentage. Null or undefined otherwise.<br><span class=\"desc-code\">Porcentaje del descuento para tipos DiscretionaryFixedPercentage o UserDefinedPercentage. En cdiscUtils.js se usa como userAmt si obdiscAmt es falsy.</span>",
                    "severity": "⚠️ ERROR DESC"
                  },
                  {
                    "name": "obdiscLineFinalgross",
                    "path": "data.discountsFromUser.manualPromotions[].obdiscLineFinalgross",
                    "type": "number",
                    "desc": "⚠️ Amount of the discount if the discount type is User Defined Line Amount. Null or undefined otherwise.<br><span class=\"desc-code\">Final gross amount of the line for UserDefinedLineAmount type. The cashier defines the final price of the line and the system calculates the discount as the difference.</span>",
                    "severity": "⚠️ ERROR DESC"
                  },
                  {
                    "name": "linesToApply",
                    "path": "data.discountsFromUser.manualPromotions[].linesToApply",
                    "type": "array of string",
                    "desc": "✅ Array containing the ID of the lines that are affected by the discount.<br><span class=\"desc-code\">Array with the IDs of the lines affected by the discount. Built in pre-apply-discount.js from the lines selected by the cashier (checkedLines).</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "isExternalConfirmedDiscount",
                    "path": "data.discountsFromUser.manualPromotions[].isExternalConfirmedDiscount",
                    "type": "boolean",
                    "desc": "✅ Indicates if the discount was sent by the external system or not. Can be used to identify candidates.<br><span class=\"desc-code\">Indicates if the discount was confirmed by the external system. Used for filtering: in cdiscUtils.js when handling errors, discounts with isExternalConfirmedDiscount=true are removed. In generateOBDiscounts() those that are NOT external are filtered to re-add them.</span>",
                    "severity": "✅ OK"
                  }
                ]
              },
              {
                "name": "optionalPromotions",
                "path": "data.discountsFromUser.optionalPromotions",
                "type": "array",
                "desc": "✅ Array containing the information of the optional discounts applied to lines.<br><span class=\"desc-code\">Array de descuentos opcionales. Se copia desde externalOptionalPromotions en addCandidateDiscounts(). Son descuentos que el cajero puede activar/desactivar.</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "searchKey",
                    "path": "data.discountsFromUser.optionalPromotions[].searchKey",
                    "type": "string",
                    "desc": "✅ Search key of the discount.<br><span class=\"desc-code\">Search key of the optional discount.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "name",
                    "path": "data.discountsFromUser.optionalPromotions[].name",
                    "type": "string",
                    "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">Optional discount name to display in the UI.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "description",
                    "path": "data.discountsFromUser.optionalPromotions[].description",
                    "type": "string",
                    "desc": "✅ Discount description to be used to give extra info in the UI.<br><span class=\"desc-code\">Optional discount description for additional information in the UI.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "amount",
                    "path": "data.discountsFromUser.optionalPromotions[].amount",
                    "type": "string",
                    "desc": "ℹ️ Discount amount to show in the UI.<br><span class=\"desc-code\">Optional discount amount to display in the UI. It is of type string (not number) for display formatting.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  }
                ]
              }
            ]
          },
          {
            "name": "orderType",
            "path": "data.orderType",
            "type": "number",
            "desc": "ℹ️ Number that indicates the type of the order (0 - Sale, 1 - Refund).<br><span class=\"desc-code\">Order type. 0 = Sale, 1 = Refund. Also used in isValidFlow() to exclude refunds (orderType !== 1) from the external system call.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "isLayaway",
            "path": "data.isLayaway",
            "type": "boolean",
            "desc": "✅ Indicates if is layaway.<br><span class=\"desc-code\">Indicates if the ticket is a layaway.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "isQuotation",
            "path": "data.isQuotation",
            "type": "boolean",
            "desc": "✅ Indicates if is quotation.<br><span class=\"desc-code\">Indicates if the ticket is a quotation.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "businessPartner",
            "path": "data.businessPartner",
            "type": "object",
            "desc": "✅ Object that contains the business partner information.<br><span class=\"desc-code\">Object with business partner info of the ticket. Contains id and searchKey.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.businessPartner.id",
                "type": "string",
                "desc": "✅ Business Partner ID.<br><span class=\"desc-code\">Business partner ID of the ticket.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "searchKey",
                "path": "data.businessPartner.searchKey",
                "type": "string",
                "desc": "✅ Search key of the Business Partner.<br><span class=\"desc-code\">Search key of the business partner of the ticket.</span>",
                "severity": "✅ OK"
              }
            ]
          },
          {
            "name": "currency",
            "path": "data.currency",
            "type": "string",
            "desc": "ℹ️ Currency of the ticket.<br><span class=\"desc-code\">Internal ID of the ticket's currency (e.g.: '100'), not the ISO code.</span>",
            "severity": "ℹ️ MEJORABLE"
          },
          {
            "name": "currency$_identifier",
            "path": "data.currency$_identifier",
            "type": "string",
            "desc": "✅ Currency ISO code.<br><span class=\"desc-code\">ISO code of the currency (e.g.: 'EUR').</span>",
            "severity": "✅ OK"
          }
        ]
      }
    ]
  },
  {
    "endpoint": "CALCULATE_DISCOUNTS",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "sessionId",
            "path": "data.sessionId",
            "type": "string",
            "desc": "✅ Session ID that identifies the current session.<br><span class=\"desc-code\">Session ID returned by the external system. Stored in the ticket as cdiscExternalresponse and reused in the next call as request.sessionId.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "ticket",
            "path": "data.ticket",
            "type": "object",
            "desc": "✅ Contains the definition of the discounts to be generated.<br><span class=\"desc-code\">Main response object. Contains id (for validation) and discountengine (with the discounts). It is validated that ticket.id matches the current ticket.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.ticket.id",
                "type": "string",
                "desc": "✅ ID of the ticket to be handled. If it does not match it will be discarded/ignored.<br><span class=\"desc-code\">Ticket ID. Validated against the current ticket: if it does not match, all discounts from the response are discarded.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "discountengine",
                "path": "data.ticket.discountengine",
                "type": "object",
                "desc": "✅ Contains the core information of the discounts.<br><span class=\"desc-code\">Main object with the discounts. Contains lines (discounts per line) and discountsFromUser (manual/by total discounts returned).</span>",
                "severity": "✅ OK",
                "children": [
                  {
                    "name": "lines",
                    "path": "data.ticket.discountengine.lines",
                    "type": "array",
                    "desc": "✅ Array containing the definition of the parameters needed for each line discount.<br><span class=\"desc-code\">Array of lines with their discounts. Iterated in generateOBDiscounts() with reduce() to generate manualPromotions with linesToApply.</span>",
                    "severity": "✅ OK",
                    "children": [
                      {
                        "name": "id",
                        "path": "data.ticket.discountengine.lines[].id",
                        "type": "string",
                        "desc": "✅ ID of the line to be handled. If it does not match it will be discarded/ignored.<br><span class=\"desc-code\">Line ID. Used to assign the returned discounts to the correct ticket line via linesToApply: [line.id].</span>",
                        "severity": "✅ OK"
                      },
                      {
                        "name": "discounts",
                        "path": "data.ticket.discountengine.lines[].discounts",
                        "type": "array",
                        "desc": "✅ Array containing all the discounts to be applied for the current line.<br><span class=\"desc-code\">Array of discounts to apply to the line. Each discount is processed: if it has a searchKey the OB rule is looked up; if not, the generic baseDiscount (cdiscDiscount of the terminal) is used.</span>",
                        "severity": "✅ OK",
                        "children": [
                          {
                            "name": "name",
                            "path": "data.ticket.discountengine.lines[].discounts[].name",
                            "type": "string",
                            "desc": "✅ Discount name to be displayed.<br><span class=\"desc-code\">Discount name. Used as a fallback chain: discount.name || discountRule.printName || discountRule.name || discount.searchKey || baseDiscount.name.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "searchKey",
                            "path": "data.ticket.discountengine.lines[].discounts[].searchKey",
                            "type": "string",
                            "desc": "✅ Search key of the discount defined in the Backend. If specified it will be used to match discount rules in POS. If found that rule will be used. If not a generic discount rule will be used.<br><span class=\"desc-code\">Search key of the discount. If specified, the rule is looked up in the POS with getDiscountBySearchKey(). If found, that rule is used (with its id, type, etc). If not, the generic baseDiscount is used.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "obdiscAmt",
                            "path": "data.ticket.discountengine.lines[].discounts[].obdiscAmt",
                            "type": "number",
                            "desc": "ℹ️ Amount to be discounted by this discount.<br><span class=\"desc-code\">Amount to discount. Both obdiscAmt and amt (fallback) are accepted: discount.obdiscAmt || discount.amt.</span>",
                            "severity": "ℹ️ MEJORABLE"
                          },
                          {
                            "name": "extraProperties",
                            "path": "data.ticket.discountengine.lines[].discounts[].extraProperties",
                            "type": "object",
                            "desc": "✅ An object which contains any extra information that needs to be stored for other purposes.<br><span class=\"desc-code\">Object with extra properties of the discount. Stored in cdiscExternalresponse and recovered in addExtraPropertiesToRequestTicket() to re-send it in subsequent calls. Allows the external system to persist information between calls.</span>",
                            "severity": "✅ OK"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "discountsFromUser",
                    "path": "data.ticket.discountengine.discountsFromUser",
                    "type": "object",
                    "desc": "✅ Object containing the information of the current discounts in the ticket and/or discounts that are proposed to be applied.<br><span class=\"desc-code\">Optional object in the response. Allows the external system to return modified manual and by total discounts. Non-external and non-duplicate manualPromotions are re-added; non-duplicate bytotalManualPromotions are re-added.</span>",
                    "severity": "✅ OK",
                    "children": [
                      {
                        "name": "bytotalManualPromotions",
                        "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions",
                        "type": "array",
                        "desc": "🔴 Array of Objects that represents the lines in the ticket.<br><span class=\"desc-code\">Array of by total discounts returned by the external system. Those not already in manualPromotions (by searchKey) are filtered and re-added with getOBDiscounts().</span>",
                        "severity": "🔴 BUG",
                        "children": [
                          {
                            "name": "id",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].id",
                            "type": "string",
                            "desc": "✅ Discount ID.<br><span class=\"desc-code\">By total discount ID.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "name",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].name",
                            "type": "string",
                            "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">By total discount name for the UI.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "discountType",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].discountType",
                            "type": "string",
                            "desc": "✅ ID of the discount type.<br><span class=\"desc-code\">ID of the discount type.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "value",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].value",
                            "type": "string",
                            "desc": "ℹ️ Identifier of the discount type.<br><span class=\"desc-code\">Search key of the discount type (discountTypeSearchKey).</span>",
                            "severity": "ℹ️ MEJORABLE"
                          },
                          {
                            "name": "discTotalamountdisc",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].discTotalamountdisc",
                            "type": "string",
                            "desc": "🔴 Amount of the discount if the discount type is Fixed Per Total or Variable Discount Per Total. Null or undefined otherwise.<br><span class=\"desc-code\">By total discount amount. NOTE: in the response schema the field is called 'discTotalamountdisc' (without the 't' after 'disc') while in the request and in all JS code 'disctTotalamountdisc' (with 't') is used. Possible typo in the response schema.</span>",
                            "severity": "🔴 BUG"
                          },
                          {
                            "name": "disctTotalpercdisc",
                            "path": "data.ticket.discountengine.discountsFromUser.bytotalManualPromotions[].disctTotalpercdisc",
                            "type": "string",
                            "desc": "⚠️ Amount of the discount if the discount type is Fixed Percentage Per Total or Variable Percentage Per Total. Null or undefined otherwise.<br><span class=\"desc-code\">By total discount percentage. Propagated from the external response.</span>",
                            "severity": "⚠️ ERROR DESC"
                          }
                        ]
                      },
                      {
                        "name": "manualPromotions",
                        "path": "data.ticket.discountengine.discountsFromUser.manualPromotions",
                        "type": "array",
                        "desc": "✅ Array containing the information of the discounts applied to lines.<br><span class=\"desc-code\">Array of manual discounts per line returned by the external system. Filtered: only those that are NOT isExternalConfirmedDiscount and are NOT already in the manualPromotions generated from lines are re-added.</span>",
                        "severity": "✅ OK",
                        "children": [
                          {
                            "name": "id",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].id",
                            "type": "string",
                            "desc": "✅ Discount ID.<br><span class=\"desc-code\">Manual discount ID.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "searchKey",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].searchKey",
                            "type": "string",
                            "desc": "✅ Search key of the discount.<br><span class=\"desc-code\">Search key of the discount. Used to filter duplicates against the discounts already generated from lines.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "name",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].name",
                            "type": "string",
                            "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">Manual discount name for the UI.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "discountType",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].discountType",
                            "type": "string",
                            "desc": "✅ ID of the discount type.<br><span class=\"desc-code\">ID of the discount type.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "value",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].value",
                            "type": "string",
                            "desc": "ℹ️ Identifier of the discount type.<br><span class=\"desc-code\">Search key of the discount type (discountTypeSearchKey).</span>",
                            "severity": "ℹ️ MEJORABLE"
                          },
                          {
                            "name": "obdiscAmt",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].obdiscAmt",
                            "type": "number",
                            "desc": "✅ Amount of the discount if the discount type is Discretionary Fixed Amount or User Defined Amount. Null or undefined otherwise.<br><span class=\"desc-code\">Fixed discount amount.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "obdiscPercentage",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].obdiscPercentage",
                            "type": "number",
                            "desc": "⚠️ Amount of the discount if the discount type is Discretionary Fixed Percentage or User Defined Percentage. Null or undefined otherwise.<br><span class=\"desc-code\">Discount percentage.</span>",
                            "severity": "⚠️ ERROR DESC"
                          },
                          {
                            "name": "obdiscLineFinalgross",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].obdiscLineFinalgross",
                            "type": "number",
                            "desc": "⚠️ Amount of the discount if the discount type is User Defined Line Amount. Null or undefined otherwise.<br><span class=\"desc-code\">Desired final gross price of the line, not the discount amount itself.</span>",
                            "severity": "⚠️ ERROR DESC"
                          },
                          {
                            "name": "linesToApply",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].linesToApply",
                            "type": "array of string",
                            "desc": "✅ Array containing the ID of the lines that are affected by the discount.<br><span class=\"desc-code\">Array with the IDs of the lines affected by the discount.</span>",
                            "severity": "✅ OK"
                          },
                          {
                            "name": "isExternalConfirmedDiscount",
                            "path": "data.ticket.discountengine.discountsFromUser.manualPromotions[].isExternalConfirmedDiscount",
                            "type": "boolean",
                            "desc": "✅ Indicates if the discount was sent by the external system or not. Can be used to identify candidates.<br><span class=\"desc-code\">Indicates if the discount was confirmed by the external system. Used as a filter: discounts with isExternalConfirmedDiscount=true are EXCLUDED from manualPromotionsFromUser.</span>",
                            "severity": "✅ OK"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "name": "availableOptionalPromotions",
                "path": "data.ticket.availableOptionalPromotions",
                "type": "array",
                "desc": "ℹ️ Array containing the information of the optional discounts applied to lines.<br><span class=\"desc-code\">Array of AVAILABLE optional discounts (not necessarily applied). Processed in DiscountsEngineSimulator.js: aggregated by searchKey, marked as applied if they are in optionalPromotions of the request, and sorted alphabetically.</span>",
                "severity": "ℹ️ MEJORABLE",
                "children": [
                  {
                    "name": "searchKey",
                    "path": "data.ticket.availableOptionalPromotions[].searchKey",
                    "type": "string",
                    "desc": "✅ Search key of the discount.<br><span class=\"desc-code\">Search key of the optional discount. Used to match with the optionalPromotions of the request and determine discountApplied.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "name",
                    "path": "data.ticket.availableOptionalPromotions[].name",
                    "type": "string",
                    "desc": "✅ Discount name. Will be used to show it in the UI.<br><span class=\"desc-code\">Optional discount name for the UI.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "description",
                    "path": "data.ticket.availableOptionalPromotions[].description",
                    "type": "string",
                    "desc": "✅ Discount description to be used to give extra info in the UI.<br><span class=\"desc-code\">Optional discount description. Fallback: p.description || discountName.</span>",
                    "severity": "✅ OK"
                  },
                  {
                    "name": "amount",
                    "path": "data.ticket.availableOptionalPromotions[].amount",
                    "type": "string",
                    "desc": "ℹ️ Discount amount to show in the UI.<br><span class=\"desc-code\">Optional discount amount to display in UI. Calculated as p.obdiscAmt || p.amt. It is string for display formatting.</span>",
                    "severity": "ℹ️ MEJORABLE"
                  },
                  {
                    "name": "discountApplied",
                    "path": "data.ticket.availableOptionalPromotions[].discountApplied",
                    "type": "boolean",
                    "desc": "✅ The property is used to determine if an optional discount has been applied to the ticket.<br><span class=\"desc-code\">Indicates if the optional discount is already applied. Determined by checking if the searchKey exists in the optionalPromotions of the request.</span>",
                    "severity": "✅ OK"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "endpoint": "GET_ITEM_DISCOUNTS",
    "section": "REQUEST",
    "fields": [
      {
        "name": "action",
        "path": "action",
        "type": "string",
        "desc": "✅ Fixed value for the present request (enum: GET_ITEM_DISCOUNTS).<br><span class=\"desc-code\">Fixed value 'GET_ITEM_DISCOUNTS'. Defined in TicketUtils.js → getItemDiscounts().</span>",
        "severity": "✅ OK"
      },
      {
        "name": "terminal",
        "path": "terminal",
        "type": "object",
        "desc": "✅ Common terminal object (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Terminal object built in createRequestHeader(). Same as in CALCULATE_DISCOUNTS.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "serviceId",
        "path": "serviceId",
        "type": "string",
        "desc": "✅ Common service ID (injected from commonClientAPIProperties-schema)<br><span class=\"desc-code\">Random 10-digit ID generated with crypto.getRandomValues(). Same mechanism as in CALCULATE_DISCOUNTS.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "sessionId",
        "path": "sessionId",
        "type": "string",
        "desc": "✅ Session ID that identifies the current session.<br><span class=\"desc-code\">Session ID. In GET_ITEM_DISCOUNTS null is passed since requestProductDiscounts() calls buildRequest() with an object without cdiscExternalresponse, so getSessionId() returns null.</span>",
        "severity": "✅ OK"
      },
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "organization",
            "path": "data.organization",
            "type": "object",
            "desc": "✅ Object that contains information of the organization doing the request.<br><span class=\"desc-code\">Object with organization info. Built in createRequestHeader() from context.organization. Same as in CALCULATE_DISCOUNTS.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.organization.id",
                "type": "string",
                "desc": "✅ Organization ID.<br><span class=\"desc-code\">Organization ID from the terminal context.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "_identifier",
                "path": "data.organization._identifier",
                "type": "string",
                "desc": "✅ Name of the Organization.<br><span class=\"desc-code\">Organization name from the terminal context.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "searchKey",
                "path": "data.organization.searchKey",
                "type": "string",
                "desc": "✅ Searchkey of the Organization.<br><span class=\"desc-code\">Search key of the organization from the terminal context.</span>",
                "severity": "✅ OK"
              }
            ]
          },
          {
            "name": "product",
            "path": "data.product",
            "type": "object",
            "desc": "✅ Object that contains the product information.<br><span class=\"desc-code\">Object with product info. Built in getProductObject() with the same fields as in CALCULATE_DISCOUNTS.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "id",
                "path": "data.product.id",
                "type": "string",
                "desc": "✅ Product ID.<br><span class=\"desc-code\">Product ID.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "_identifier",
                "path": "data.product._identifier",
                "type": "string",
                "desc": "✅ Product name.<br><span class=\"desc-code\">Product name.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "searchKey",
                "path": "data.product.searchKey",
                "type": "string",
                "desc": "✅ Search key of the Product.<br><span class=\"desc-code\">Search key of the product. Same as in CALCULATE_DISCOUNTS, it is sent duplicated as 'searchkey' and 'searchKey' for backward compatibility.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "upc",
                "path": "data.product.upc",
                "type": "string",
                "desc": "✅ UPC of the product.<br><span class=\"desc-code\">UPC/EAN code of the product. Mapped from product.uPCEAN.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "listPrice",
                "path": "data.product.listPrice",
                "type": "number",
                "desc": "✅ Can be ignored.<br><span class=\"desc-code\">List price of the product. The YML itself indicates it can be ignored.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "standardPrice",
                "path": "data.product.standardPrice",
                "type": "number",
                "desc": "✅ Can be ignored.<br><span class=\"desc-code\">Standard price of the product. The YML itself indicates it can be ignored.</span>",
                "severity": "✅ OK"
              },
              {
                "name": "useExtPromotions",
                "path": "data.product.useExtPromotions",
                "type": "boolean",
                "desc": "✅ Always true.<br><span class=\"desc-code\">Indicates if the product uses external promotions. The YML indicates it is always true for this endpoint (only candidate products are queried).</span>",
                "severity": "✅ OK"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "endpoint": "GET_ITEM_DISCOUNTS",
    "section": "RESPONSE",
    "fields": [
      {
        "name": "data",
        "path": "data",
        "type": "object",
        "desc": "✅ Contains the request/response data.<br><span class=\"desc-code\">Data payload object.</span>",
        "severity": "✅ OK",
        "children": [
          {
            "name": "sessionId",
            "path": "data.sessionId",
            "type": "string",
            "desc": "✅ Session ID that identifies the current session.<br><span class=\"desc-code\">Session ID returned by the external system. In GET_ITEM_DISCOUNTS it is stored together with availablePromos in cdiscExternalresponse.</span>",
            "severity": "✅ OK"
          },
          {
            "name": "availablePromos",
            "path": "data.availablePromos",
            "type": "array",
            "desc": "✅ Array that contains discounts information.<br><span class=\"desc-code\">Array with information about available promotions for the product. Displayed in the 'Available Discounts' UI. If there is an error an empty array is returned.</span>",
            "severity": "✅ OK",
            "children": [
              {
                "name": "promoInfo",
                "path": "data.availablePromos[].promoInfo",
                "type": "string",
                "desc": "✅ Text to be displayed for each available promotion.<br><span class=\"desc-code\">Text to display for each available promotion. Free format, informative.</span>",
                "severity": "✅ OK"
              }
            ]
          }
        ]
      }
    ]
  }
];
