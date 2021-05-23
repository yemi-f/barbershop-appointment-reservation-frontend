import dayjs from "dayjs";

export const getNextBusinessDay = () => {
    if (dayjs().format("d") === "0") {
        return dayjs().add(1, "day").format("YYYY-MM-DD");
    }

    if (dayjs().format("d") === "6") {
        return dayjs().add(2, "day").format("YYYY-MM-DD");
    }

    return dayjs().format("YYYY-MM-DD");
}

