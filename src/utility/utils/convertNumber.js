

export const convertNumber = (number) => {
    let flag = true
    const ArrLama = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    const ArrNumber = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    let a = ""
    let i = 0
    while (flag) {
        while (number >= ArrNumber[i]) {
            number = number - ArrNumber[i]
            a = a + ArrLama[i]
            if (number < 1) {
                 flag = false
            }         
        }
        i++
    }
    return a
}
