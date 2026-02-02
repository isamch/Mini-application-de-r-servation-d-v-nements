/**
* Regular Expression Patterns
*
* @description
* Common regex patterns for validation.
* Used in DTOs and Services.
*/
export const REGEX_PATTERNS = {
/**
* Password: at least 8 characters, uppercase, lowercase, number
* Example: Password123, MyPass@2024
*/
PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,

/**
* Phone: numbers only, 10-15 digits
* Example: 0612345678, +212612345678
*/
PHONE: /^[0-9]{10,15}$/,

/**
* Slug: letters, numbers, and hyphens only
* Example: my-blog-post, hello-world-123
*/
SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

/**
* Username: letters, numbers, underscore, 3-20 characters
* Example: john_doe, user123
*/
USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
} as const;