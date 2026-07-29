let resultText = "";


// =====================
// 정리하기 버튼
// =====================

document.getElementById("runButton")
    .addEventListener("click", function () {

        const fileInput =
            document.getElementById("fileInput");


        if (fileInput.files.length === 0) {
            alert("파일을 선택해주세요.");
            return;
        }


        const file =
            fileInput.files[0];


        const reader =
            new FileReader();


        reader.onload = function (e) {

            let text =
                e.target.result;


            text = cleanText(text);



            const splitFile =
                document.getElementById("splitFile").checked;


            if (splitFile) {

                splitTextFile(text);

            }
            else {

                resultText = text;
                createDownload();

            }


            document.getElementById("status").innerText =
                "삭제 완료!";

        };


        reader.readAsText(file);

    });





// =====================
// 텍스트 정리 함수
// =====================

function cleanText(text) {

    // =====================
    // 숨은 문자 제거
    // =====================

    text = text.replace(
        /[\u200B-\u200D\u2060\uFEFF]/g,
        ""
    );



    // =====================
    // 문구 변경
    // =====================

    const replaceFrom =
        document.getElementById("replaceFrom").value;

    const replaceTo =
        document.getElementById("replaceTo").value;


    if (replaceFrom !== "") {

        text =
            text.replaceAll(
                replaceFrom,
                replaceTo
            );

    }



   // =====================
// 직접 입력 문구 포함 줄 삭제
// =====================

const deleteText =
    document.getElementById("deleteText").value;


if (deleteText !== "") {

    text =
        text
            .split("\n")
            .filter(line => !line.includes(deleteText))
            .join("\n");

}



    // =====================
    // 날짜 삭제
    // =====================

    const deleteDate =
        document.getElementById("deleteDate").checked;

    if (deleteDate) {

        const datePattern =
            /\d{4}년\s\d{1,2}월\s\d{1,2}일\s(오전|오후)\s\d{1,2}:\d{2},?\s/g;


        text =
            text.replace(
                datePattern,
                ""
            );

    }


    // =====================
    // 날짜 삭제 + 시간 유지
    // =====================

    const keepTime =
        document.getElementById("keepTime").checked;

    if (keepTime) {

        const timePattern =
            /\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전|오후)\s\d{1,2}:\d{2}),?/g;


        text =
            text.replace(
                timePattern,
                "$1"
            );

    }




    // =====================
    // 이미지 코드 삭제
    // =====================

    const deleteImageCode =
        document.getElementById("deleteImageCode").checked;


    if (deleteImageCode) {

const imagePattern =
    /\b[a-f0-9]{50,}\.(png|jpg|jpeg)\b/gi;


        text =
            text.replace(
                imagePattern,
                ""
            );

    }



    // =====================
    // 사진 읽지 않음 삭제
    // =====================

    const deletePhotoText =
        document.getElementById("deletePhotoText").checked;


    if (deletePhotoText) {

        text =
            text.replace(
                /^.*<사진 읽지 않음>.*$/gm,
                ""
            );

    }


// 빈 이름 사용자 변경

const replaceEmptyName =
    document.getElementById("replaceEmptyName").checked;


if (replaceEmptyName) {

    const name =
        document.getElementById("emptyName").value;


    // 쉼표 뒤 빈 이름
    text =
        text.replace(
            /,[ \t]*:/g,
            `, ${name} :`
        );


    // 시간 뒤 빈 이름 (오후 11:57  :)
    text =
        text.replace(
            /((오전|오후)\s\d{1,2}:\d{2})[ \t]+:/g,
            `$1 ${name} :`
        );

    // 줄 시작 빈 이름
text =
    text.replace(
        /^[ \t]*:[ \t]*/gm,
        `${name} : `
    );

}


    // =====================
    // 허용된 이름 없는 줄 삭제
    // =====================

    text =
        text
            .split("\n")
            .filter(line =>
                /(초록|레곤|공백| )\s*:/.test(line)
            )
            .join("\n");



    // =====================
    // 빈 줄 제거
    // =====================

    const removeEmpty =
        document.getElementById("removeEmpty").checked;


    if (removeEmpty) {

        text =
            text
                .split("\n")
                .filter(line => line.trim() !== "")
                .join("\n");

    }


    return text;

}




// =====================
// 일반 다운로드
// =====================

function createDownload() {

    const blob =
        new Blob(
            [resultText],
            { type:"text/plain" }
        );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");


    a.href = url;

    a.download =
        "정리된파일.txt";


    a.click();


    URL.revokeObjectURL(url);

}




// =====================
// 파일 분할
// =====================

function splitTextFile(text) {


    const lines =
        text.split("\n");


    const size =
        Number(
            document.getElementById("splitLines").value
        );


    let files = [];


    for (
        let i = 0;
        i < lines.length;
        i += size
    ) {


        files.push(
            lines
                .slice(i, i + size)
                .join("\n")
        );

    }


    downloadParts(files);

}





// =====================
// ZIP 다운로드
// =====================

function downloadParts(files) {


    const zip =
        new JSZip();


    files.forEach(
        (content, index) => {

            zip.file(
                `정리파일_${index + 1}.txt`,
                content
            );

        });


    zip.generateAsync({
        type: "blob"
    })
        .then(function (content) {


            const url =
                URL.createObjectURL(content);


            const a =
                document.createElement("a");


            a.href =
                url;


            a.download =
                "정리파일.zip";


            a.click();


            document.getElementById("status").innerText =
                files.length + "개 파일을 ZIP으로 생성 완료";


        });

}





// =====================
// 테스트 샘플 생성 (앞 1000줄)
// =====================

document.getElementById("makeSampleButton")
    .addEventListener("click", function () {


        const fileInput =
            document.getElementById("fileInput");


        if (fileInput.files.length === 0) {

            alert("먼저 파일을 선택해주세요.");
            return;

        }



        const file =
            fileInput.files[0];


        const reader =
            new FileReader();



        reader.onload = function (e) {


            let text =
                e.target.result;



            // 정리 적용
            text =
                cleanText(text);



            // 앞 1000줄
            const sample =
                text
                    .split("\n")
                    .slice(0, 1000)
                    .join("\n");



            const blob =
                new Blob(
                    [sample],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const a =
                document.createElement("a");


            a.href =
                url;


            a.download =
                "테스트_샘플.txt";


            a.click();


        };


        reader.readAsText(file);


    });
