
export const shortText = (text) => {
    if (text.length > 25) {
        text = text.substring(0, 25) + '...';
    }
    return text;
}