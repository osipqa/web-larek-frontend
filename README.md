# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Этот проект представляет собой веб-приложение, предназначенное для просмотра и покупки товаров. 
Ниже вы найдете подробное описание основных функциональных возможностей.

## Основные возможности

Карточки товаров:
-  При запуске проекта отображаются карточки товаров.
-  Каждая карточка содержит логотип и корзину заказов.
-  Нажатие на изображение товара открывает попап с деталями товара.

Попап товара:
-  В попапе дублируются название, изображение, краткое описание и цена товара.
-  Попап можно закрыть, нажав на крестик или на пустое место вне попапа.
-  Возможность добавить товар в корзину, нажав кнопку "Купить".

Карточка товара:
-  Каждая карточка товара содержит категорию, название, цену и изображение товара.

Корзина заказов:
-  Открывается в виде попапа.
-  Содержит название товара, цену, кнопку удаления и общую сумму заказа.
-  Закрывается при нажатии на пустое место или крестик.
-  Кнопка "Оформить" переходит к оформлению заказа.

Оформление заказа:
-  Выбор способа оплаты: онлайн или при получении.
-  Указание адреса доставки и переход к следующему шагу.
-  Ввод номера телефона и email-почты.
-  Подтверждение заказа и отображение уведомления об успешном оформлении.


## Представление о коде

Проект организован по архитектурному шаблону MVP (Model-View-Presenter).
В этой архитектуре каждый компонент выполняет свою четко определенную роль, что улучшает поддерживаемость и читаемость кода.

### Структура MVP

1. **Модель (Model):**
Отвечает за работу с данными приложения.
  - Отвечает за работу с данными приложения.
  - Классы: `Api`, `ApiListResponse`, `ApiPostMethods`.

2. **Представление (View):**
Отображает данные пользователю.
  - Отвечает за отображение данных пользователю.
  - Классы: `ICard`, `IGallery`, `IPage`.

3. **Представитель (Presenter):**
Связывает Модель и Представление.
  - Осуществляет связь между Моделью и Представлением.
  - Классы: `EventEmitter`, `EventName`, `Subscriber`, `EmitterEvent`.
  - Файлы: `event.ts`.

4. **Контроллер (Controller):**
Управляет взаимодействием пользователя.
  - Управляет взаимодействием пользователя с приложением.
  - Классы: `IEvents`, `IBasket`.

## Базовый код

1. Класс "Popup" 
Базовый класс, управляющий поведением модального окна - открытием и закрытием.

  Поля:
  -  closeButton (HTMLButtonElement): Кнопка закрытия модального окна.
  -  modalSelector (string): Уникальный селектор модального окна, используемый для поиска кнопки закрытия.

  Методы:
  -  openModal(): Открывает модальное окно товара или корзины на главной странице, используя шаблон с идентификатором "modal".
  -  closeModal(): Закрывает модальное окно при нажатии на кнопку закрытия или на оверлей.

2. Класс "EventEmitter" (Брокер событий):
  -  Класс EventEmitter предоставляет реализацию брокера событий.
  -  Используется для управления событиями и их обработчиками в приложении.
  -  Реализует базовые методы для работы с событиями, такие как on, off, emit, и другие.

3. Класс "Api" (Взаимодействие с серверным API):
  -  Класс Api служит для выполнения HTTP-запросов к серверу.
  -  Реализует базовую логику для обработки ответов от сервера, включая обработку ошибок.
  -  Предоставляет методы для отправки GET и POST (и других) запросов.

## Интерфейсы

1. Интерфейс IPage

Представляет главную страницу приложения.
-  counter (number): Элемент счетчика на странице.
-  gallery (IGallery): Объект типа IGallery, представляющий галерею карточек товаров.
**Примечание:** Рендеринг в DOM осуществляется через методы классов, которые, помимо управления данными, также взаимодействуют с DOM. Происходит подсчет элементов, находящихся внутри корзины, и обновление соответствующего DOM-элемента с отображением текущего счетчика.

2. Интерфейс IGallery

Представляет галерею карточек товаров.
-  items (ICard[]): Массив объектов, представляющих отдельные карточки товаров в галерее.

3. Интерфейс ICard

Представляет карточку товара или элемент галереи.
-  image (Строка): URL изображения товара.
-  title (Строка): Название карточки товара.
-  category (Строка): Категория карточки товара.
-  price (Число | null): Цена карточки товара (может быть null).

4. Интерфейс IProd

Представляет детализированный продукт, расширяя интерфейс ICard.
-  id (Строка): Уникальный идентификатор продукта.
-  description (Строка): Описание продукта.

5. Интерфейс IOrder

Представляет заказ на продукт.
-  namepay (Строка): Информация о способе оплаты.
-  address (Строка): Информация об адресе доставки заказа.

6. Интерфейс IInfo

Представляет контактную информацию.
-  email (Строка): Адрес электронной почты.
-  phone (Строка): Номер телефона.

7. Интерфейс IBasket

Представляет корзину покупок, объединяя информацию из интерфейсов IOrder и IInfo. IBasket объединяет информацию из интерфейсов IOrder и IInfo, 
используя композицию, IBasket содержит ссылки на объекты, реализующие соответствующие интерфейсы. 
-  items (IProd[]): Массив объектов, представляющих продукты в корзине.
-  totalprice (Число): Общая сумма корзины.

8. Интерфейс IEvents

Интерфейс, определяющий базовые методы для работы с событиями.
-  on<T extends object>(event: EventName, callback: (data: T) => void): void: Подписаться на событие.
-  emit<T extends object>(event: string, data?: T): void: Инициировать событие с данными.
-  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void: Создать триггер-функцию для события.

## Файл api.ts

Файл api.ts содержит определения типов и класс для взаимодействия с серверным API.

1. Типы данных
ApiListResponse<Type>
Тип данных, представляющий ответ от сервера в виде списка.

-  total (Число): Общее количество элементов в списке.
-  items (Массив типа Type): Список элементов.

ApiPostMethods
Тип данных, представляющий методы запросов для создания (POST), обновления (PUT) и удаления (DELETE) ресурсов на сервере.

2. Класс Api

Класс Api предоставляет методы для выполнения HTTP-запросов к серверу.
Конструктор
-  baseUrl (Строка): Базовый URL сервера.
-  options (Объект RequestInit): Дополнительные параметры запроса, такие как заголовки и другие настройки.

Методы
-  get(uri: string): Выполняет HTTP-запрос методом GET по указанному URI.
-  post(uri: string, data: object, method: ApiPostMethods = 'POST'): Выполняет HTTP-запрос методом POST или другим указанным методом, отправляя указанные данные.

Защищенный метод
-  handleResponse(response: Response): Promise<object>: Обрабатывает ответ от сервера, возвращая либо данные в случае успешного запроса, либо сообщение об ошибке.

## Файл event.ts

1. EventName
Тип данных, представляющий имя события. Может быть строкой или регулярным выражением.

2. Subscriber
Тип данных для обработчика события. Функция, которая принимает данные и выполняет определенные действия.

3. EmitterEvent
Тип данных, представляющий событие, отправляемое эмиттером.
-  eventName (Строка): Имя события.
-  data (Неопределенный): Данные события.

## Класс EventEmitter
Класс, предоставляющий реализацию брокера событий.

1. Свойства
-  _events (Map<EventName, Set<Subscriber>>): Карта событий и их подписчиков.

2. Методы
-  on<T extends object>(eventName: EventName, callback: (event: T) => void): void: Установить обработчик на событие.
-  off(eventName: EventName, callback: Subscriber): void: Снять обработчик с события.
-  emit<T extends object>(eventName: string, data?: T): void: Инициировать событие с данными.
-  onAll(callback: (event: EmitterEvent) => void): void: Подписаться на все события.
-  offAll(): void: Сбросить все обработчики.
-  trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void: Сделать коллбек триггером, генерирующим событие при вызове.