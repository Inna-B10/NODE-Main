export default {
	// Используем Node environment, а не jsdom (по умолчанию для браузера)
	testEnvironment: 'node',

	// Отключаем трансформацию (babel/jest), чтобы ESM файлы читались напрямую
	transform: {},

	// Опционально: указываем папку с тестами
	testMatch: ['**/tests/**/*.test.js'],

	// Можно явно указать расширение для модульной системы
	moduleFileExtensions: ['js', 'mjs', 'json'],

	// Для читаемого вывода
	verbose: true,
}
