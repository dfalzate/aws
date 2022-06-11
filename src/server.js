import express from "express";
import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usuarios = [];

const credentials = new aws.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sns = new aws.SNS({
  credentials: credentials,
  region: "us-east-1",
});

app.post("/user", async (req, res) => {
  const data = req.body;
  usuarios.push(data);
  res.send("Usuario agregado");
  sns
    .publish({
      Message: `Data: ${JSON.stringify(data)}`,
      Subject: "Usuario creado",
      TopicArn: process.env.TOPIC_ARN,
    })
    .promise()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server started on port http://localhost:${PORT}`),
);
server.on("error", (err) => console.log(err));
