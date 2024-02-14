import { successTemplate, popup } from "..";
import { cloneTemplate } from "../utils/utils";
import { Success } from "./popup";

// Cache to store API responses
export const apiCache: Record<string, any> = {};

export function handleSuccess(res: any) {													// Function to handle the success response
  const success = new Success(cloneTemplate(successTemplate), {  	// Create a success message component
    onClick: () => {
      popup.close();
    },
  });
  popup.render({
    content: success.render({																			 // Render the success message with the total amount
      total: res.total,
    }),
  });
};