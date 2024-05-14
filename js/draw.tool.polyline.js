(function() {

    var parent = null;
    var drawing = false;
    var element = null;

    var points = [];

    function mousedown(event) {
        console.log('polyline mousedown', event);
        if (!drawing) {
            drawing = true;
            var currPoint = svgDoc.transformPoint(event);
            points.push([currPoint.x, currPoint.y]);

            console.log('polyline mousedown drawing');

            parent.circle(24).cx(currPoint.x).cy(currPoint.y).addClass('point-circle').fill(GlobalStatus.getFontColor());

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
        console.log('polyline mousemove');
        if (drawing) {
            var svgPoint = svgDoc.transformPoint(event);
            var x = svgPoint.x;
            var y = svgPoint.y;
            var pointsTmp = points.concat();
            pointsTmp.push([x, y]);

            if (!element) {
                element = parent.polyline(points).fill(GlobalStatus.getFillColor()).style("fill-opacity", GlobalStatus.getFillOpacity()).stroke({
                    width: GlobalStatus.getLineSize(),
                    color: GlobalStatus.getFontColor(),
                    dasharray: getDashArray() // Set the line style based on line type
                });
            } else {
                element.plot(pointsTmp);
            }
        }
        return false;
    }

    function mouseup(event) {
        console.log('polyline mouseup ' + element);
        if (event.button == 2) {
            if (element.attr("points").split(",").length > 2) {
                element.pickable();
            } else {
                parent.removeElement(element);
            }
            document.oncontextmenu = function() {
                return false;
            }
            drawing = false;
            points = [];
            element = null;
            return;
        } else if (drawing && element) {
            var svgPoint = svgDoc.transformPoint(event);
            var x = svgPoint.x;
            var y = svgPoint.y;
            points.push([x, y]);
            element.plot(points);
            
            // Create a circle within the same SVG group as the polyline
            var circle = parent.circle(24).cx(x).cy(y).addClass('point-circle').fill(GlobalStatus.getFontColor());
            element.add(circle);
        }
        return false;
    }
    

    var listener = {
        mousedown: mousedown,
        mousemove: mousemove,
        mouseup: mouseup,
    };


    var Polyline = function(parentEle) {
        parent = parentEle;
        svgDoc = parent.doc();
        DrawTool.init(svgDoc, listener);
        this.stop = function() {
            DrawTool.stop(svgDoc, listener);
            drawing = false;
            points = [];
            element = null;
            document.oncontextmenu = function() {
                return true;
            }
        };
    };

    this.DrawTool.Polyline = Polyline;

})();