// Middleware to verify if the user has one of the allowed roles
export const verifyRoles = (...allowedRoles) => {
	// "allowedRoles" is a rest parameter → it collects all arguments into an array
	// Example: verifyRoles('Admin', 'Editor')

	return (req, res, next) => {
		// 1. If the request object has no roles attached, reject with Unauthorized
		if (!req?.roles) return res.sendStatus(401)

		// 2. Copy allowedRoles into a new array (for clarity/logging)
		const rolesArray = [...allowedRoles]
		console.log('Allowed roles:', rolesArray)
		console.log('User roles:', req.roles)

		// 3. Compare user roles against allowed roles
		//    - For each role in req.roles, check if it’s in allowedRoles
		//    - "map" returns [true/false/...]
		//    - "find" returns the first true, or undefined if none
		const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)

		// 4. If no matching role found → Unauthorized
		if (!result) return res.sendStatus(401)

		// 5. Otherwise, user has permission → move to the next middleware/route
		next()
	}
}
