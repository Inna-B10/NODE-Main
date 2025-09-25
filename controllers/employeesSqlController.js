import { addEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from '../services/employeeServices.js'

//* ---------------------------- Add New Employee ---------------------------- */
export const handleAddEmployee = (req, res) => {
	const { first_name, last_name, job_title } = req.body

	if (!first_name || !last_name || !job_title) {
		return res.status(400).json({ error: 'All fields are required!' })
	}
	try {
		const result = addEmployee({ first_name, last_name, job_title })
		res.status(201).json({
			message: 'Employee added successfully',
			employee: {
				id: result.lastInsertRowid,
				first_name,
				last_name,
				job_title,
			},
		})
	} catch (err) {
		console.error('Database error:', err.message)
		res.status(500).json({ error: 'Failed to add new employee' })
	}
}

//* ---------------------------- Get All Employees --------------------------- */
export const handleGetAllEmployees = (req, res) => {
	try {
		const employees = getAllEmployees()
		res.json(employees)
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to fetch employees' })
	}
}

//* --------------------------- Get Employee By Id --------------------------- */
export const handleGetEmployeeById = (req, res) => {
	const { id } = req.params

	try {
		const employee = getEmployeeById(id)
		if (!employee) {
			return res.status(404).json({ error: 'Employee not found!' })
		}
		res.json(employee)
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to fetch employee' })
	}
}

//* ----------------------------- Update Employee ---------------------------- */
export const handleUpdateEmployee = (req, res) => {
	const { id } = req.params
	const { first_name, last_name, job_title } = req.body

	if (!first_name || !last_name || !job_title) {
		return res.status(400).json({ error: 'All fields are required!' })
	}

	try {
		const result = updateEmployee(id, { first_name, last_name, job_title })

		if (result.changes === 0) {
			return res.status(404).json({ error: 'Employee not found' })
		}
		res.json({ message: 'Employee updated!' })
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to update employee' })
	}
}

//* ----------------------------- Delete Employee ---------------------------- */
export const handleDeleteEmployee = (req, res) => {
	const { id } = req.params
	try {
		const result = deleteEmployee(id)
		if (result.changes === 0) {
			return res.status(404).json({ error: 'Employee not found' })
		}
		res.json({ message: 'Employee deleted successfully' })
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to delete employee' })
	}
}
