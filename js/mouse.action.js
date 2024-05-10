(function(){
    $('#svgPanel').contextPopup({
    items: [
        {
            label: ' Cancel',
            action: function () {
                GlobalStatus.unPickAll();
                return false;
            }
        },
        {
            label: ' Choose',
            action: function () {
                $("#tool_pick").click();
                return false;
            }
        },
        {
            label: ' Clear Screen',
            action: function () {
                $("#clear_all").click();
                return false;
            }
        }
    ]
});
})();