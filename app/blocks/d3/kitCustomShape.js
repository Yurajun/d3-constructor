module.exports = ['d3Factory',
	function (d3Factory){

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',
			priority: 1,

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars
				// сработает когда загрузится d3. Фунция синхронной загрузки
				d3Factory.d3().then(function (d3){
					console.log($scope.editor);
					$scope.shape = {
						dragBehavior: {
							dragOrigin: {
								x: 0,
								y: 0
							},
							snapFactor: 2
						},
						svg: {
							rootNode: $element[0],
							d3Object: d3.select($element[0])
						}
					};

					$scope.setDragOrigin = (x, y) => {
						$scope.shape.dragBehavior.dragOrigin = {x, y};
					};

					$scope.snapToGrid = (editor, coords, factor) => {
						console.log(`${editor}, ${factor}`);

						if (editor){
							const snapFactor = Math.abs(factor) || 2;
							const a          = editor.grid.sizeXmm / snapFactor;
							const b          = editor.grid.sizeYmm / snapFactor;

							return {
								x: Math.round(coords.x / a) * a,
								y: Math.round(coords.y / b) * b
							};
						}// else {

						// }
						return coords;
					};

					$scope.moveTo = (x, y, shouldSnap) => {

						$scope.setDragOrigin(x, y);
						let coords = {x, y};
						if (shouldSnap){
							coords = $scope.snapToGrid($scope.editor, coords, $scope.shape.dragBehavior.snapFactor);
						}
						$scope.shape.svg.d3Object.attr('transform', `translate(${coords.x}, ${coords.y})`);
					};

					let dragInitiated = false;

					$scope.shape.dragBehavior.dragObject = d3.behavior.drag()
						.origin(() => {
							return $scope.shape.dragBehavior.dragOrigin;
						})
						.on('dragstart', () => {
							const e = d3.event.sourceEvent; // mousedown, touchstart
							e.stopPropagation();

							if (e.which === 1){
								dragInitiated = true;
								$scope.editor.behavior.d3.drag.dragging = true;
							}
						})
						// Двигаем фигуру по полю
						.on('drag', () => {
							const coords = {x: d3.event.x, y: d3.event.y};
							if (dragInitiated){
								$scope.moveTo(coords.x, coords.y, true);
								$scope.shape.svg.d3Object.classed('dragging', true);
							}
						})
						.on('dragend', () => {
							$scope.editor.behavior.d3.drag.dragging = false;
							dragInitiated = false;
							$scope.shape.svg.d3Object.classed('dragging', false);
						});

					$scope.shape.svg.d3Object.call($scope.shape.dragBehavior.dragObject);

					const t = d3.transform($scope.shape.svg.d3Object.attr('transform'));

					const tSnapped = $scope.snapToGrid($scope.editor, {
						x: t.translate[0],
						y: t.translate[1]
					}, $scope.shape.dragBehavior.snapFactor);

					$scope.setDragOrigin(tSnapped.x, tSnapped.y);

					$scope.shape.svg.d3Object.attr('transform', `translate(${tSnapped.x}, ${tSnapped.y})`);

					/*
					$scope.shape.svg.d3Object.append('rect')
						.attr('x', 0)
						.attr('x', 0)
						.attr('width', 50)
						.attr('height', 50)
						.style('fill', 'orange');
					*/

				});
			}
		};
	}
];
