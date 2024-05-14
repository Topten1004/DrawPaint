(function() {

    var parent = null;
    var drawing = false;
    var textElement = null;
    var startPoint = null;

    function mousedown(event) {
        console.log('text mousedown');
        if (!drawing) {
            drawing = true;
            startPoint = svgDoc.transformPoint(event);
            var fontSize = 12; // You can set the default font size here
            var fontColor = "black"; // You can set the default font color here
            var userInput = prompt("Enter text:"); // Prompt the user for text input
            if (userInput !== null) { // Check if the user entered text
                textElement = parent.text(userInput).font({size: fontSize, fill: fontColor}).move(startPoint.x, startPoint.y);
            }
        }
        return false;
    }

    function mousemove(event) {
        console.log('text mousemove');
        if (drawing) {
            var svgPoint = svgDoc.transformPoint(event);
            var x = svgPoint.x;
            var y = svgPoint.y;

            textElement.move(x, y);
        }
        return false;
    };

    function mouseup(event) {
        console.log('text mouseup');
        if (drawing) {
            drawing = false;
            // Here you might want to handle finalizing or saving the text if needed
        }
        return false;
    }

    var listener = {
        mousedown: mousedown,
        mousemove: mousemove,
        mouseup: mouseup,
    };

    var Text = function(parentEle) {
        parent = parentEle;
        console.log(parent);
        svgDoc = parent.doc();
        DrawTool.init(svgDoc, listener);
        this.stop = function() {
            DrawTool.stop(svgDoc, listener);
        };
    };

    this.DrawTool.Text = Text;

})();
