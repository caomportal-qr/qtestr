var scanner = null;
var cameras = {}

function scanned(value) {
    location.href = value;
}

function select_change(e) {
    var obj = $(e.currentTarget);
    var id = obj.val();
    var camera = cameras[id];
    scanner.start(camera);
    localStorage.setItem("default_camera_id", id);
}

function main() {
    scanner = new Instascan.Scanner({ video: $("#preview")[0] });
    scanner.addListener("scan", scanned);

    var default_camera_id = localStorage.getItem("default_camera_id");

    var askreload = false;

    Instascan.Camera.getCameras()
    .then(function (orig_cameras) {

        if(orig_cameras.length == 0) {
            throw "カメラが見つかりませんでした。";
        }

        var select = $("<select>");
        select.change(select_change);

        for(var i = 0; i < orig_cameras.length; i++) {
            var camera = orig_cameras[i];
            cameras[camera.id] = camera;

            var option = $("<option>")
            .attr("value", camera.id)
            .text(camera.name);
            if(camera.id == default_camera_id) {
                option.attr("selected", "");
            }
            select.append(option);

//2018.01.19 test start
//            if(default_camera_id == null && i == 0) {
//                default_camera_id = camera.id;
//            }
            if(default_camera_id == null && i == 0 || default_camera_id != camera.id && i == 0) {
                default_camera_id = camera.id;
            }
//2018.01.19 test end

            askreload = askreload || camera.name == null;
        }

        if(default_camera_id != null) {
            var camera = cameras[default_camera_id];
            scanner.start(camera);
        }

//2018.01.19 test start
//var ilength=orig_cameras.length;
//var message="orig_cameras.length";
//var icamera=camera.id;
//var message2="camera.id";
// alert(message+ilength);
// alert(message2+icamera);
//           if(orig_cameras.length ==1 && camera.id != 0 ) {
//                default_camera_id = 0;
//            }
//2018.01.19 test end

        if(orig_cameras.length > 1) {
            $(".select-place").replaceWith(
                $("<label>")
                .text("カメラを選択：")
                .append(select)
            );
        }

        if(askreload) {
            $("body").append(
                $("<div>")
                .text("カメラの使用を許可してください。その後、ページを再読み込みしてください。")
                .css({color: "red"})
            );
        }

    })
    .catch(function(err) {
        alert(err);
    });
}

$(main);
