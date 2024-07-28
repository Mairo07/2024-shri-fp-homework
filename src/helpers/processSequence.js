/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import { allPass, always, andThen, curry, gt, ifElse, length, lt, otherwise, pipe, tap, test } from 'ramda';
import Api from '../tools/api';
import { __ } from 'ramda';

const api = new Api();

//Валидация строки
const longerTwoChar = pipe(length, gt(__, 2));
const shorterTenChar = pipe(length, lt(__, 10));
const isNumberAndDot = test(/^[0-9]*\.?[0-9]+$/);

const validation = allPass([
    longerTwoChar,
    shorterTenChar,
    isNumberAndDot
])

const handleValidation = curry((handleError, value) => 
    ifElse(
      validation,
      always(value),
      () => handleError('ValidationError')
    )(value)
);

//действия с числами
const strToNumber = pipe(parseFloat, Math.round);
const thenGetLength = andThen(length);
const square = (num) => Math.pow(num, 2)
const thenGetSquare = andThen(square);
const getRemainder = (num) => num % 3;
const thenGetRemainder = andThen(getRemainder);

//Запросы к Апи
const convertToBinary = (num) => {
    return api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: num}).then(({result}) => result);
};
const getAnimalName = (id) => {
    return api.get(`https://animals.tech/${id}`, id).then(({result}) => result); 
} 
const thenGetAnimalName = andThen(getAnimalName);

const processSequence = async ({value, writeLog, handleSuccess, handleError}) => {
    const tapWriteLog = ((value) => tap(writeLog, value));   
    const thenTapWriteLog = andThen(tapWriteLog);
    const handleValidationError = handleValidation(handleError);

    const result = pipe(
        tapWriteLog,
        handleValidationError,
        strToNumber,
        tapWriteLog,
        convertToBinary,
        thenTapWriteLog, 
        thenGetLength,
        thenTapWriteLog,
        thenGetSquare,
        thenTapWriteLog,
        thenGetRemainder,
        thenTapWriteLog,
        thenGetAnimalName,
        andThen(handleSuccess),
        otherwise(handleError)
    )

    await result(value)
}

export default processSequence;
