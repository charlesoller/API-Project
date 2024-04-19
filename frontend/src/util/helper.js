export const capitalize = (word) => {
    return word.slice(0,1).toUpperCase() + word.slice(1)
}

export const formatDate = (date) => {
    const dateObj = new Date(Date.parse(date))
    return convertMonthNumToString(dateObj.getMonth()) + " " + dateObj.getFullYear()
}

const convertMonthNumToString = (month) => {
    switch (month) {
        case 0:
            return "January"
        case 1:
            return "February"
        case 2:
            return "March"
        case 3:
            return "April"
        case 4:
            return "May"
        case 5:
            return "June"
        case 6:
            return "July"
        case 7:
            return "August"
        case 8:
            return "September"
        case 9:
            return "October"
        case 10:
            return "November"
        case 11:
            return "December"
    }
}
