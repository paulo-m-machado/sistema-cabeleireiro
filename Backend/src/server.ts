import 'dotenv/config';

console.log("INICIOU ARQUIVO");

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({
    ok: true
  });
});

app.listen(3333, () => {
  console.log("SERVIDOR SUBIU");
});