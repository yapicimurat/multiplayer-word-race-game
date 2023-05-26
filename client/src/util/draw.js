

const text = (context, text, x, y, colorString, fontString) => {
    context.font = fontString;
    context.fillStyle = colorString;
    context.fillText(text, x, y);
};

const clear = (context, width, height) => {
    context.clearRect(0, 0, width, height);
};

const rect = (context) => {

};

export {text, rect, clear};
