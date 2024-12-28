export const formatRegexMap: FormatRegexMap = {
    'yyyy': '(\\d{4})',    // Anno (4 cifre)
    'MM': '(\\d{2})',      // Mese (2 cifre)
    'dd': '(\\d{2})',      // Giorno (2 cifre)
    'ii': '(\\d{2})',      // Incremento (2 cifre)
};

function generateRegExp(format: string): RegExp {  
    let regexStr = format;
    for (let key in formatRegexMap) {
        regexStr = regexStr.replace(key, formatRegexMap[key]);
    }
    return new RegExp(`^${regexStr}$`);
}

function getFormatPositionMap(value: string): FormatPositionMap {
    const regex = /(yyyy|MM|dd|ii)/g;
    const matches = value.match(regex);
    const resultMap = new Map<string, number>();

    if (matches) {
        matches.forEach((component, index) => {
            resultMap.set(component, index + 1);
        });
    }

    const resultObject: FormatPositionMap = {};
    resultMap.forEach((value, key) => {
        resultObject[key] = value;
    });

    return resultObject;
}

function transformMapping(regex: RegExp, positionMap: FormatPositionMap, value: string): ValueMapping {
    const match = value.match(regex);
    if (!match) {
        throw new Error("Input value does not match the format.");
    }

    const valueMapping: ValueMapping = {};
    Object.entries(positionMap).forEach(([key, position]) => {
        valueMapping[key] = match[position];
    });

    return valueMapping;
}

function getFormattedMapping(format: string, currentMapping: ValueMapping): string {
    let value = format;
    Object.entries(currentMapping).forEach(([key, mappedValue]) => {
        value = value.replace(key, mappedValue);
    });
    return value;
}

export function generateNewVersion(format: string, lastestVersion: string | undefined): string {
    const regex: RegExp = generateRegExp(format);
    const positionMap: FormatPositionMap = getFormatPositionMap(format);
    let lastestVersionMap: ValueMapping;
    if(lastestVersion) {
        lastestVersionMap = transformMapping(regex, positionMap, lastestVersion);
    } else {
        lastestVersionMap = {}
    }

    // Increment logic
    const currentDate = new Date();
    const today = {
        yyyy: currentDate.getFullYear().toString(),
        MM: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        dd: currentDate.getDate().toString().padStart(2, '0'),
    };

    if (lastestVersionMap.yyyy === today.yyyy && lastestVersionMap.MM === today.MM && lastestVersionMap.dd === today.dd) {
        // Same date, increment the counter
        lastestVersionMap.ii = (parseInt(lastestVersionMap.ii) + 1).toString().padStart(2, '0');
    } else {
        // New date, reset the counter
        lastestVersionMap.yyyy = today.yyyy;
        lastestVersionMap.MM = today.MM;
        lastestVersionMap.dd = today.dd;
        lastestVersionMap.ii = '01';
    }

    return getFormattedMapping(format, lastestVersionMap);
}
