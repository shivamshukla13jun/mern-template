// import { RolePermissionService } from "microservices/permission-services/RolePermission.service";
import { createDefaultUsers } from "./deafaultUsers";
const createDefaultData = async (): Promise<void> => {
    try {
         console.log("Starting default data initialization...");
         await createDefaultUsers();
        console.log("Default data initialization completed successfully");

    } catch (error) {
        console.error("Error initializing default data:", error);
      
    }
};
export default createDefaultData