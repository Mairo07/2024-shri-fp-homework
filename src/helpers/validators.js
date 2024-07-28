import {
  map,
  curry,
  allPass,
  values,
  equals,
  pipe,
  length,
  gte,
  filter,
  flip,
  keys,
  propSatisfies,
  not,
  prop,
  countBy,
} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const maxInArr = (arr) => Math.max(...arr) 

//Функции-предикаты на цвета
const isColor = curry((color, shape) => equals(color, shape));
const isOrange = isColor('orange');
const isGreen = isColor('green');
const isBlue = isColor('blue');
const isRed = isColor('red');
const isWhite = isColor('white');

//Определенная форма конкретного цвета
const isTriangleWhite = propSatisfies(isWhite, 'triangle');
const isCircleWhite = propSatisfies(isWhite, 'circle');
const isSquareWhite = propSatisfies(isWhite, 'square');
const isStarWhite = propSatisfies(isWhite, 'star');
const isStarRed = propSatisfies(isRed, 'star');
const isSquareGreen = propSatisfies(isGreen, 'square');
const isTrianglGreen = propSatisfies(isGreen, 'triangle');
const isCircleBlue = propSatisfies(isBlue, 'circle');
const isSquareOrange = propSatisfies(isOrange, 'square');

//Форма не указанного цвета
const isNotRedStar = pipe(isStarRed, not);
const isNotWhiteStar = pipe(isStarWhite, not);
const isNotWhiteSquare = pipe(isSquareWhite, not);

//Подсчет колличество форм определенного цвета
const countBlue = pipe(values, filter(isBlue), length);
const countRed = pipe(values, filter(isRed), length);
const countGreen = pipe(values, filter(isGreen), length);

//Геттеры - цвет формы
const getTriangleColor = prop('triangle');
const getSquareColor = prop('square');

//Предикаты проверяют соответствует ли колличество форм указанного цвета заданному
const minTwoGreenShapes = pipe(countGreen, flip(gte)(2));
const twoGreenShapes = pipe(countGreen, equals(2));
const oneRedShape = pipe(countRed, equals(1));

//Проверяем, что разные формы одног цвета
const threeShapesOneColor = pipe(
    values,
    filter(color => color !== 'white'),
    countBy(color => color),
    values,
    maxInArr,
    flip(gte)(3)
);
const isTriangleAndSquareOneColor = (shapes) => equals(getSquareColor(shapes), getTriangleColor(shapes));

const allOrangePredicats = pipe(
    keys,
    map(key => propSatisfies(isOrange, key))
);

const allGreenPredicats = pipe(
    keys,
    map(key => propSatisfies(isGreen, key))
);

const isAllGreen = shapes => allPass(allGreenPredicats(shapes))(shapes);
const isAllOrange = shapes => allPass(allOrangePredicats(shapes))(shapes);



// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  allPass([isTriangleWhite, isCircleWhite]),
  isStarRed,
  isSquareGreen,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = minTwoGreenShapes;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => equals(countBlue(shapes), countRed(shapes));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isCircleBlue,
    isStarRed,
    isSquareOrange
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = threeShapesOneColor

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    twoGreenShapes,
    isTrianglGreen,
    oneRedShape
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllOrange;
// export const validateFieldN7 = (shapes) => {
//     const isAllOrange = allPass(allOrangePredicats(shapes))
//     return isAllOrange(shapes)   
// };

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    isNotRedStar, 
    isNotWhiteStar
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllGreen

// export const validateFieldN9 = (shapes) => {
//     // v1(allGreenPredicats(shapes))
//     // const isAllGreen = allPass(allGreenPredicats(shapes))
//     const ans = isAllGreen(shapes) 
//     return ans(shapes)   
// };

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isTriangleAndSquareOneColor, isNotWhiteSquare])
