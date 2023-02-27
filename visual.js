var table;

var grid = [];

function init(){
    table = document.createElement("table");

    document.body.appendChild(table);

    for(let y = 0; y < 9; y++){
        let tmpTr = document.createElement("tr");
        let tmpGrid = [];
        for(let x = 0; x < 9; x++){
            let tmpTd = document.createElement("td");
            let tmpSelect = document.createElement("select");
            for(let n = 0; n < 10; n++){
                let tmpOption = document.createElement("option");
                if(n !== 0){
                    tmpOption.value = n;
                    tmpOption.text = n;
                }else{
                    tmpOption.value = n;
                    tmpOption.text = "";
                }


                tmpSelect.appendChild(tmpOption);

            }
            tmpGrid.push({td:tmpTd,select:tmpSelect});
            tmpTd.appendChild(tmpSelect)
            tmpTr.appendChild(tmpTd);
        }
        grid.push(tmpGrid)
        table.appendChild(tmpTr);
    }
}

function updateTable(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            grid[y][x].td.innerText = grid[y][x].value;
        }
    }
}

init();