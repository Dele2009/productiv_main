import { Organization } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";
import { NextResponse } from "next/server";
import * as yup from "yup";
const schema = yup.object({
  passcode: yup.string().required("Passcode is required"),
  logoUrl: yup
    .string()
    .url("Logo URL must be a valid URL"),
    employeeIdPrefix: yup.string().required("Id prefix is required").length(6, "Id prefix should not be more than 6 characters")
});
type Data = yup.InferType<typeof schema>;

const handlePut = async ({ data, user }: HandlerArgs<Data>) => {
  const { passcode, logoUrl, employeeIdPrefix } = data!;

  try {
    // Here you would typically update the organization in your database
    // For example:
    const org = await Organization.findByPk(user.organization.id);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    await org.update({
      passcode,
      logoUrl,
      employeeIdPrefix,
    });

    return NextResponse.json({
      message: "Organization setup completed successfully",
    });
  } catch (error) {
    console.error("Error setting up organization:", error);
    return NextResponse.json(
      { error: "Failed to set up organization" },
      { status: 500 }
    );
  }
};
export const PUT = withValidationAndRole<Data>(["admin"], handlePut, schema);
