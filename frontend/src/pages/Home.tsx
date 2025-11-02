import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">CRUD App</h1>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Войти</Button>
              </Link>
              <Link to="/register">
                <Button>Регистрация</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Добро пожаловать в CRUD приложение
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Создавайте, редактируйте и управляйте своими постами
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg">Начать</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Войти
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Создание</CardTitle>
              <CardDescription>Создавайте новые посты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Легко создавайте новые записи с заголовком и содержанием
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Редактирование</CardTitle>
              <CardDescription>Обновляйте свои посты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Редактируйте существующие записи в любое время
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Удаление</CardTitle>
              <CardDescription>Управляйте своими данными</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Удаляйте ненужные записи одним кликом
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

