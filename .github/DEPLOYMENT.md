# 🚀 Deployment Guide

Это руководство по настройке автоматического деплоя на VDS сервер через GitHub Actions.

## 🔐 Настройка Secrets

В настройках репозитория (Settings → Secrets and variables → Actions) добавьте следующие secrets:

### Обязательные secrets:

| Secret Name | Описание | Пример |
|------------|----------|---------|
| `SSH_HOST` | IP адрес или домен вашего VDS сервера | `123.456.789.012` или `yourdomain.com` |
| `SSH_USERNAME` | Имя пользователя для SSH подключения | `root` или `ubuntu` |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ для подключения | Содержимое файла `~/.ssh/id_rsa` |

### Опциональные secrets:

| Secret Name | Описание | По умолчанию |
|------------|----------|-------------|
| `SSH_PORT` | Порт SSH | `22` |
| `DEPLOY_PATH` | Путь для деплоя на сервере | `/var/www/race-time-front` |

## 🗝️ Генерация SSH ключей

Если у вас нет SSH ключей, создайте их:

```bash
# На вашем локальном компьютере
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Скопируйте публичный ключ на сервер
ssh-copy-id -i ~/.ssh/id_rsa.pub username@your-server-ip

# Содержимое приватного ключа добавьте в GitHub Secrets
cat ~/.ssh/id_rsa
```

## 🛠️ Подготовка VDS сервера

### 1. Подключитесь к серверу:
```bash
ssh username@your-server-ip
```

### 2. Установите необходимые компоненты:
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем PM2 (менеджер процессов)
sudo npm install -g pm2

# Настраиваем PM2 для автозапуска
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 3. Создайте директорию для приложения:
```bash
sudo mkdir -p /var/www/race-time-front
sudo chown $USER:$USER /var/www/race-time-front
```

### 4. Настройте Nginx (опционально):
```bash
sudo apt install nginx -y

# Создайте конфигурацию для сайта
sudo tee /etc/nginx/sites-available/race-time-front << 'EOF'
server {
    listen 80;
    server_name your-domain.com; # Замените на ваш домен
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Активируйте сайт
sudo ln -s /etc/nginx/sites-available/race-time-front /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔄 Workflow процесс

### Автоматический деплой происходит при:
- Push в ветку `main`
- Все проверки (lint, build) прошли успешно

### Процесс деплоя:
1. **Проверка кода** - ESLint, TypeScript
2. **Сборка** - `npm run build`
3. **Подключение к VDS** - через SSH
4. **Бэкап** - сохранение предыдущей версии
5. **Копирование файлов** - новая версия
6. **Запуск** - через PM2
7. **Проверка здоровья** - убеждаемся что все работает

## 📱 Мониторинг

### Команды для проверки статуса на сервере:
```bash
# Статус приложения
pm2 status

# Логи приложения
pm2 logs race-time-front

# Перезапуск приложения
pm2 restart race-time-front

# Мониторинг в реальном времени
pm2 monit
```

## 🐛 Устранение неполадок

### Если деплой не работает:

1. **Проверьте SSH подключение:**
```bash
ssh -i ~/.ssh/id_rsa username@your-server-ip
```

2. **Проверьте логи GitHub Actions:**
   - Перейдите в раздел "Actions" в репозитории
   - Откройте последний workflow
   - Проверьте логи каждого шага

3. **Проверьте статус на сервере:**
```bash
pm2 logs race-time-front --lines 50
```

4. **Проверьте права доступа:**
```bash
ls -la /var/www/race-time-front/
```

## 🔐 Безопасность

### Рекомендации:
- Используйте отдельного пользователя для деплоя (не root)
- Настройте фаервол (UFW)
- Используйте SSL сертификаты (Let's Encrypt)
- Регулярно обновляйте систему

```bash
# Настройка базового фаервола
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🚀 Готово!

После настройки всех secrets и подготовки сервера, каждый push в ветку `main` будет автоматически деплоить ваше приложение на VDS сервер!