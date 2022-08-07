// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
exports.lambdaHandler = async (event, context) => {
  var body;

  if(event.path == "/categoria"){
    body = await getByCategoria();
  }

  if(event.path == "/categoriaScan"){
    body = await getByCategoriaWithScan();
  }

  if (event.httpMethod == "GET" && event.path == "/hello") {
    body = await getItem();
  }
  if (event.httpMethod == "POST" && event.path == "/hello") {
    body = await createItem();
  }
  if (event.httpMethod == "DELETE" && event.path == "/hello") {
    body = await deleteItem();
  }
  if (event.httpMethod == "PUT" && event.path == "/hello") {
    body = await putItem();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };
  return response;
};

async function getByCategoriaWithScan(){
    var params = {
        TableName: 'PrimeiraTabela',
        ProjectionExpression: "id, nome",
        FilterExpression: "#categoria = :categoria and contains(nome, :nome)",
        ExpressionAttributeNames: {
            '#categoria': "categoria"
        },
        ExpressionAttributeValues: {
            ":categoria": 3,
            ":nome": "Maria"
        }
    }

    try {
        const data = await docClient.scan(params).promise();
        body = data.Items;
      } catch (err) {
        body = err;
      }

      return body
}

async function getByCategoria(){
    var params = {
        TableName: 'PrimeiraTabela',
        IndexName: 'categoria-index',
        ProjectionExpression: "id, nome",
        FilterExpression: "contains(nome, :nome)",
        KeyConditionExpression: '#categoria = :categoria',
        ExpressionAttributeNames: {
            '#categoria': "categoria"
        },
        ExpressionAttributeValues: {
            ":categoria": 3,
            ":nome": "Maria"
        }
    }

    try {
        const data = await docClient.query(params).promise();
        body = data.Items;
      } catch (err) {
        body = err;
      }

      return body
}

async function getItem() {
  var params = {
    TableName: "PrimeiraTabela",
    Key: { id: "3" },
  };
  var body;
  try {
    const data = await docClient.get(params).promise();
    body = data.Item;
  } catch (err) {
    body = err;
  }
  return body;
}

async function createItem() {
  var params = {
    TableName: "PrimeiraTabela",
    Item: {
      id: "3",
      nome: "Ghabriel Winicius",
      categoria: 2,
    },
  };

  try {
    const data = await docClient.put(params).promise();
    body = data.Item;
  } catch (err) {
    body = err;
  }
  return body;
}

async function deleteItem() {
  var params = {
    TableName: "PrimeiraTabela",
    Key: { id: "2" },
  };
  var body;
  try {
    const data = await docClient.delete(params).promise();
    body = data.Item;
  } catch (err) {
    body = err;
  }
  return body;
}

async function putItem() {
  var params = {
    TableName: "PrimeiraTabela",
    Key: { id: "3" },
    UpdateExpression: "set nome = :nome, categoria = :categoria",
    ExpressionAttributeValues: {
      ":nome": "Maria do Carmo",
      ":categoria": 3,
    },
  };
  var body;
  try {
    const data = await docClient.update(params).promise();
    body = data.Item;
  } catch (err) {
    body = err;
  }
  return body;
}
