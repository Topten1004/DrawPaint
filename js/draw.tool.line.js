(function() {

    var parent = null;
    var drawing = false;
    var element = null;
    var startPoint = null;

    function mousedown(event) {
        console.log('line mousedown');
        if (!drawing) {
            drawing = true;
            startPoint = svgDoc.transformPoint(event);
            element = parent.line(startPoint.x, startPoint.y, startPoint.x, startPoint.y)
                           .fill(GlobalStatus.getFillColor())
                           .style("fill-opacity", GlobalStatus.getFillOpacity())
                           .stroke({
                                width: GlobalStatus.getLineSize(),
                                color: GlobalStatus.getFontColor(),
                                dasharray: getDashArray() // Set the line style based on line type
                           });
        }
        return false;
    }

    function getDashArray() {
      
        var lineType = GlobalStatus.getLineType();

        switch (lineType) {
            case 'solid':
                return null; // No dasharray for solid line
            case 'dashed':
                return "5,5"; // Dasharray for dashed line
            case 'dot':
                return "1,3"; // Dasharray for dotted line
            default:
                return null;
        }
    }

    function mousemove(event) {
        console.log('line mousemove');
        if (drawing) {
            var svgPoint = svgDoc.transformPoint(event);
            var x = svgPoint.x;
            var y = svgPoint.y;

            element.plot([
                [startPoint.x, startPoint.y],
                [x, y]
            ]);
        }
        return false;
    }

    function mouseup(event) {
        console.log('line mouseup ' + element);
        if (drawing) {
            drawing = false;
            if (element.attr("x1") != element.attr("x2") && element.attr("y1") != element.attr("y2")) {
                var svgPoint = svgDoc.transformPoint(event);
                var endPoint = {
                    x: svgPoint.x,
                    y: svgPoint.y
                };

                // Calculate the angle of the line
                var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;

                // Define the arrowhead element
                var arrowhead = parent.marker(7.5, 7.5, function(add) {
                    add.path("M0,0 L10,5 L0,10 z").fill(GlobalStatus.getFontColor());
                });

                // Append the arrowhead to the line
                element.marker('end', arrowhead);

                element.plot([
                    [startPoint.x, startPoint.y],
                    [endPoint.x, endPoint.y]
                ]);
                element.pickable();
            } else {
                parent.removeElement(element);
            }
        }
        return false;
    }


    var listener = {
        mousedown: mousedown,
        mousemove: mousemove,
        mouseup: mouseup,
    };


    var Line = function(parentEle) {
        parent = parentEle;
        svgDoc = parent.doc();
        DrawTool.init(svgDoc, listener);
        this.stop = function() {
            DrawTool.stop(svgDoc, listener);
        };
    };

    this.DrawTool.Line = Line;

})();
