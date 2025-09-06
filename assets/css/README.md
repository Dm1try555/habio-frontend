# HABIO-CHAT CSS Architecture

## Структура стилей

### Widget Styles
- **widget-base.css** - Базовые стили виджета (FAB, позиционирование)
- **widget-panel.css** - Стили панели виджета (заголовок, контент)
- **widget-channels.css** - Стили каналов связи (кнопки, иконки)
- **widget-forms.css** - Стили форм (callback форма, инпуты)
- **widget-chat.css** - Стили чат-виджета (сообщения, ввод)

### Demo Page Styles
- **demo-page.css** - Базовые стили демо страницы
- **demo-features.css** - Стили сетки возможностей
- **demo-api.css** - Стили API endpoints

### Admin Panel Styles
- **admin-base.css** - Базовые стили админ панели
- **admin-tables.css** - Стили таблиц и статусов
- **admin-buttons.css** - Стили кнопок
- **admin-modals.css** - Стили модальных окон

### Main CSS
- **main.css** - Главный файл, импортирующий все стили + утилиты

## Принципы

1. **Модульность** - каждый компонент имеет свой CSS файл
2. **Переиспользование** - общие стили вынесены в утилиты
3. **Responsive** - все стили адаптивные
4. **Производительность** - минимизация CSS, оптимизация селекторов
5. **Поддержка** - четкая структура для легкого сопровождения

## Использование

```vue
<style scoped>
@import '~/assets/css/widget-base.css';
@import '~/assets/css/widget-panel.css';
</style>
```

Или через главный файл (автоматически подключается в nuxt.config.ts):

```vue
<style scoped>
/* Стили уже подключены глобально */
</style>
```