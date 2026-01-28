import { email } from "better-auth";
import config from "../config";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        const adminData = {
            name: config.admin_name,
            email: config.admin_email,
            password: config.admin_password,
            role: config.admin_role,
            phone: config.admin_phone,
            image: config.admin_image
        }
        const existingAdmin = await prisma.user.findUnique({
          where: {
            email: adminData.email as string,
          },
        });
        if (existingAdmin) {
          console.log("Admin already exists");
          return;
        }

        const signupAdmin = await fetch(
          `${config.backend_url}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "origin": config.frontend_url
            },
            body: JSON.stringify(adminData),
          },
        );

        console.log(signupAdmin);

        if(signupAdmin.ok){
            await prisma.user.update({
              where: {
                email: adminData.email as string,
              },
              data: {
                emailVerified: true,
              },
            });
        }
        console.log('Admin Seeding Completed');
    } catch (error) {
        console.log(error);
    }
}

seedAdmin();