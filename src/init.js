import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server"

const PORT = parseInt(process.env.PORT) || 4000;

const startListening = () => console.log(`server listening on port http://localhost:${PORT}`);
app.listen(PORT,startListening);

