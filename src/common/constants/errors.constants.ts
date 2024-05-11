export const AppError = {
    USER_EXIST: "User with this email exist",
    USER_NOT_EXIST: "User does not exist.",
    WRONG_DATA: "Wrong data.",
    USER_CREATION_ERROR: "User creation error.",
    USER_UPDATE_ERROR: "Failed to update user name.",
    STORAGE_UPDATE_ERROR: "Failed to update storage name.",
    SHELF_UPDATE_ERROR: "Failed to update shelf name.",
    STORAGE_DELETE_ERROR: "Failed to delete storage.",
    STORAGE_NOT_FOUND: "Storage not found",
    SHELF_NOT_FOUND: "Shelf not found",
    PRODUCT_NOT_FOUND: "Product not found",
    SHELF_DELETE_ERROR: "Failed to delete shelf.",
    NO_ACCESS: "You do not have access to the requested resource.",
    CANNOT_ADD_YOURSELF: "You cannot add yourself",
    USER_ALREADY_IN_LIST: "The user is already in the list of storage users",
    PRODUCT_UPDATE_ERROR: "Failed to update product.",
    PREVIOUS_PRODUCT_STATE_NOT_FOUND: "Previous state of the product not found.",
    SHELF_SUPPORT_ISSUE: "The shelf cannot support the updated weight or volume.",
    SUPPLY_PRODUCT_PROPERTIES_ERROR: "Not enough space or weight overload to accommodate the entire product.",
    NO_VALUES: "No values",
    ARCHIVE_ERROR: "Failed to archive product.",
    PASSWORDS_MUST_NOT_MATCH: "Passwords must not match.",
    INVALID_RECOVERY_CODE: "Invalid recovery code or code expired"
} as const;

export const ValidationError = {
    INVALID_EMAIL: "Invalid email format.",
    MUST_BE_STRING: "Must be a string.",
    MUST_BE_DATE: "Must be a Date.",
    MUST_BE_NUMBER: "Must be a number.",
    MUST_BE_OBJECT: "Must be a object.",
    MUST_BE_ARRAY: "Must be a array.",
    INVALID_PASSWORD_LENGTH: "Invalid Password length.",
    INVALID_ADDRESS_LENGTH: "Invalid Address length.",
    INVALID_NAME_LENGTH: "Invalid Name length.",
    INVALID_RECOVERY_CODE: "Invalid Code."
} as const;
