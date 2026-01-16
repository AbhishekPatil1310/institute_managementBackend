import { query } from "./db.js";

const test = async () => {
  const res = await query("SELECT NOW()");
  console.log(res.rows[0]);
};

test();
