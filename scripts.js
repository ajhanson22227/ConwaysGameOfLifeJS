class GameCell {
	constructor(element, row, column, isAlive) {
		this.Alive = isAlive;
		this.NextStatus = isAlive;
		this.Row = row;
		this.Column = column;
		this.Element = element;
	}

	SetNextLifeStatus = (isAlive) => {
		this.NextStatus = isAlive;
	}

	UpdateCellElement = () => {
		this.Element.classList.remove(...this.Element.classList);
		this.Element.classList.add("cell", `${this.NextStatus ? "alive" : "dead"}`)
		this.Alive = this.NextStatus;
	}

	GetLivingNeighborsCount = (arrayOfCells) => {
		let aliveCount = 0;
		for (let i = this.Row - 1; i <= this.Row + 1; i++){
			for (let j = this.Column - 1; j <= this.Column + 1; j++){
				if (i == this.Row && j == this.Column) continue;

				let cell = arrayOfCells[i][j];
				if (cell === undefined) continue;

				if (cell.Alive){
					aliveCount++;
				}
			}
		}
		return aliveCount;
	}
}

class Game {
	constructor(gridSize){
		this.ActualGridSize = gridSize + 2;
		this.HtmlGridSize = gridSize;
		this.CurrentGrid = [];
		this.Running = false;
		this.EditingEnabled = true;
	}

	InitiatePage = () => {
		const container = document.getElementById("grid-container");
		container.style.width = container.style.height;
		container.style.gridTemplateColumns = `repeat(${this.HtmlGridSize}, 1fr)`;
		container.style.gridTemplateRows = `repeat(${this.HtmlGridSize}, 1fr)`;

		const startBtn = document.getElementById("start-btn");
		startBtn.textContent = this.Running ? "Stop" : "Start";
		startBtn.addEventListener("click", (e) => {
			this.Running = !this.Running;
			this.EditingEnabled = !this.Running;
			startBtn.textContent = this.Running ? "Stop" : "Start";
		})

		for (let i = 0; i < this.ActualGridSize; i++){
			let row = []
			for (let j = 0; j < this.ActualGridSize; j++){
				let gridCell = this.IsBorder(i, j) ? undefined : this.CreateCellDiv();
				let gameCell;
				if (gridCell !== undefined){
					let isAlive = Math.round(Math.random());
					container.appendChild(gridCell);
					gameCell = new GameCell(gridCell, i, j, isAlive);
					gameCell.UpdateCellElement();

					gameCell.Element.addEventListener("click", (e) => {
						if (this.EditingEnabled){
							gameCell.SetNextLifeStatus(!gameCell.Alive);
							gameCell.UpdateCellElement();
						}
					})
				}
				row.push(gameCell);
			}
			this.CurrentGrid.push(row);
		}
	}

	UpdateNextGeneration = () => {
		for (let i = 0; i < this.ActualGridSize; i++){
			for (let j = 0; j < this.ActualGridSize; j++){
				let cell = this.CurrentGrid[i][j];
				if (cell === undefined) continue;
				let aliveNeighborCount = cell.GetLivingNeighborsCount(this.CurrentGrid)

				if (cell.Alive && (aliveNeighborCount <= 1 || aliveNeighborCount >= 4)){
					cell.SetNextLifeStatus(false);
				}
				else if (!cell.Alive && aliveNeighborCount == 3){
					cell.SetNextLifeStatus(true)
				}
			}
		}

		for (let i = 1; i < this.ActualGridSize; i++){
			for (let j = 1; j < this.ActualGridSize; j++){
				let cell = this.CurrentGrid[i][j];
				if (cell === undefined) continue;
				cell.UpdateCellElement();
			}
		}
	}

	IsBorder = (row, column) => {
		if (row == 0 || row == this.ActualGridSize-1){
			return true;
		}
		if (column == 0 || column == this.ActualGridSize-1){
			return true;
		}
		return false;
	}

	CreateCellDiv = () => {
		let gridCell = document.createElement("div");
		gridCell.className = `cell`;
		return gridCell;
	}

	RunGame = (timeout) => {
			setInterval(() => {
				if (this.Running) {
					this.UpdateNextGeneration();
				}
			}, timeout)
	}
}

let game = new Game(32);
game.InitiatePage();
game.RunGame(750)
