//change manual inputed values higher than max to max value

$(function ()    {
  $("input").change(function () {
    var element = $(this)
    var max = parseInt($(this).attr('max'));
    var min = parseInt($(this).attr('min'));
    if ($(this).val() > max) {
      var actualElementClassList = document.getElementById(this.id).classList;
      $(this).val(max);
      $(this.classList.add("red-border"))
      setTimeout(function () {
        actualElementClassList.remove("red-border")
      }, 300);
    } 
    else if ($(this).val() < min) {
      $(this).val(min);
    }
  });
});

