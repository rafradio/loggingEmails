let button = document.getElementById("request");
let data = document.querySelectorAll(".new-dates");
let idProject = document.getElementById("idProject");
let testClean = document.getElementById("CleanAll");

testClean.onclick = function() {
    removeTillEnd(this);
//    removeTillEnd();
//    const func = removeTillEnd.bind(this);
//    func();
}

function removeTillEnd(self) {
    if (self.nextElementSibling != null && self.nextElementSibling.tagName != "SCRIPT" && self.nextElementSibling.id != "noDelete") {
        console.log("nextElementSibling = ", self.nextElementSibling);
        let element = self.nextElementSibling;
        element.remove();
        removeTillEnd(self);
    } else {
        return;
    }
}

function requestApi(dataToSend) {
    let url = new URL(window.location.href);
    url.pathname = "/LoggingEmails/request.php";
    fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',

                },
                body: JSON.stringify(dataToSend)
                })
                .then(response => response.json())
                .then(data => {
//                    console.log("Проверка false = ", data.data);
                    if (data.data !== "no data") {
                        txtArray = data.data.split("\n");
                        console.log(txtArray[0]);
                        console.log("Проверяем боди = ", data.test);
                        parseData(txtArray);
                        document.getElementById("info").innerHTML = "";
                    } else {
                        document.getElementById("info").innerHTML = "Данных нет";
                    }
                    
                })
                .then(() => {startAnalyse();});
}
            
button.onclick = function () {
    if (data[0].value != "" && idProject.value != "0") {
        console.log(data[0].value, idProject.options[idProject.selectedIndex].text);
        let projectName = idProject.options[idProject.selectedIndex].text;
        let myDate = new Date(data[0].value);
        const convert = (dig) => (dig.length > 1) ? dig : "0" + dig;

        const options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let myDateString = myDate.getFullYear().toString() +  convert(parseInt(myDate.getMonth()+1).toString()) + convert(myDate.getDate().toString());
        console.log(myDate.toLocaleDateString('en-us', options));
        console.log(myDateString);
        let dataToSend = {"date": myDateString, "project": projectName};
        requestApi(dataToSend);
    } else {
        document.getElementById("info").innerHTML = "Данные не выбраны";
    }
}

function parseData(txtArray) {
    return new Promise ((resolve, reject) => {
        const elem = document.createElement('br');
        let dataList = document.getElementById("filterList");
        if (dataList.options.length > 0) {dataList.innerHTML = "";}
        let anketaData = [];
        let emailData = [];
        let tableData = document.getElementById("myTable");
        if (tableData == null) {
            tableData = document.createElement('table');
        }
        else {
            tableData.innerHTML = "";
        };
        tableData.id = "myTable";
        txtArray.forEach((el, ind) => {
            let dataString = el.trim().split(" ");
            let rowData = tableData.insertRow(ind);
            let c = rowData.insertCell(0);
            c.innerHTML = el.trim();
            let pattern1 = /^\d+\:$/g;
            if (pattern1.test(dataString[0].trim())) {
                anketaData.push(dataString[0].replace(":",""));
                emailData.push(dataString[dataString.length-1]);
            };

        });

        const createSelect = (data, id) => {
            const elemSelect = document.getElementById(id);
            if (elemSelect.options.length > 0) {elemSelect.innerHTML = "";}
            let option = document.createElement("option");
            option.value = -1;
            option.text = (id == "idAnketa") ? "Выберите ID": "Выберите email";
            elemSelect.add(option);
            Array(...new Set(data)).forEach((el, ind) => {
                let option = document.createElement("option");
                option.value = ind;
                option.text = el;
                elemSelect.add(option);
            });
        };
//        document.body.appendChild(elem);
        createSelect(anketaData, "idAnketa");
        createSelect(emailData, "emailUser");
//        document.body.appendChild(elem);
        document.body.appendChild(tableData);
        
        resolve();

    });
}

function startAnalyse() {
    let myTable = document.getElementById("myTable");
    let idAnketaFilter = document.getElementById("idAnketa");
    let emailUserFilter = document.getElementById("emailUser");
    let buttonForList = document.getElementById("filterData");
    let dataList = document.getElementById("filterList");
    let findDataList = document.getElementById("findData");
    let clearDataList = document.getElementById("cleanData");
    
    function findData() {
        let filter = this.options[this.selectedIndex].text;
        console.log(filter);
        let tr = myTable.getElementsByTagName("tr");
        Array.from(tr).forEach((elm, ind) => {
            let td = elm.getElementsByTagName("td");
            let txtValue = td[0].innerHTML;
            elm.style.display = (txtValue.includes(filter)) ? "block": "none";
        });
    }
    
    buttonForList.onclick = function() {
        Array.from([idAnketaFilter, emailUserFilter]).forEach((el, index) => {
            let firstOption = (dataList.options.length > 0) ? dataList.options[0].text : null;
            if (el.selectedIndex != 0) {
                if (firstOption !== null) {
                    if ([...el.options].map(o => o.text).indexOf(firstOption) == -1) {
                        return;
                    } else if ([...dataList.options].map(o => o.text).indexOf(el.options[el.selectedIndex].text) != -1) {
                        return;
                    }
                }
                console.log(el.selectedIndex);
                let option = document.createElement("option");
                option.text = el.options[el.selectedIndex].text;
                dataList.insertBefore(option, dataList.firstChild);
            }
        });
    }
    
    findDataList.onclick = function() {
        let tr = myTable.getElementsByTagName("tr");
        Array.from(tr).forEach((elm, ind) => {
            let txtValue = elm.getElementsByTagName("td")[0].innerHTML;
            let flag = false;
            [...dataList.options].map(o => o.text).forEach((elTxt, index) => {
                if (txtValue.includes(elTxt)) flag = true;
            });
            elm.style.display = (flag) ? "block": "none";
        });
    }
    
    clearDataList.onclick = () => {dataList.innerHTML = "";}
    
//    idAnketaFilter.onchange = findData.bind(idAnketaFilter);
//    emailUserFilter.onchange = findData.bind(emailUserFilter);
    

    
}



