import "./env.js";
import { connectToDb } from "./src/db/db.js";
import app from "./src/app.js";

await connectToDb();

const PORT= process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("app is live at port:", PORT);
});