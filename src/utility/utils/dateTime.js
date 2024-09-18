import moment from "moment"

export const epochToDateTime = (epoch) => moment.unix(epoch).format("DD/MM/YYYY HH:mm:ss")

export const timeToDHM = (duration) => {
    const Day = Math.floor(duration / (24 * 3600000))
    const Hour = Math.floor((duration - (Day * 24 * 3600000)) / 3600000)
    const Minute = Math.floor(
        (duration - (Day * 24 * 3600000) - (Hour * 3600000)) / 60000
    )
    return { Day, Hour, Minute }
}

export const ISODateParam = (momentDate) => `${momentDate.format("YYYY-MM-DD")}T07:00:01Z`

// export const ISODateTimeParam = (momentDate) =>
//   `${momentDate.format('YYYY-MM-DD')}T${momentDate.format('HH-mm-ss')}Z`;
export const ISODateTimeParam = (momentDate) => momentDate.toISOString()
