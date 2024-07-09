import express from "express";
import { appDataSource } from "./data-source";
import { router } from "./router/router";


appDataSource.initialize().then(() => {
    const app = express();

    app.use(express.json());

    app.use("/profile/",router);

    return app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Error during Data Source initialization:", error);
});
