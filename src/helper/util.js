

//Converts string to array where index 0: Unix timestamp, 1: Telemetry ID, 2: Value
const stringConverter = (data) => {
    data = data.replace("[", "")
    data = data.replace("]", "")

    const newData = data.split(":")

    return newData

}

export default stringConverter