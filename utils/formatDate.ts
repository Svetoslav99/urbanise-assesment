export const formatDate = async (dateString: String) => {
    const [year, month, day] = dateString.split('-');
    const formattedDate = new Date(+year, +month, +day).toISOString();
    return formattedDate;
};
