module.exports = ['d3Factory', 'kitSystemShapeDrawerFactory',
	function (d3Factory, drawer){ // eslint-disable-line no-unused-vars

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',
			priority: 2,

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars

				d3Factory.d3().then(function (d3){
					$scope.shape.moniker = 'core.gear';

					$scope.shape.svg.shapeObject = drawer.drawGearWheel(
						d3,
						$scope.shape.svg.d3Object,
						8,
						5,
						9,
						2,
						{
							innerRadius: 10,
							outerRadius: 20
						},
						{
							innerRadius: 10,
							outerRadius: 32
						}
					);

					// 8, 5, 9, 2
					// FPS / frame per second
					// jank-free
					// 60 FPS - 1000 / 60 ~ 16.6ms
					// requestAnimationFrame

					const speed = 0.05;      // gain
					const start = Date.now();

					d3.timer(() => {
						$scope.shape.svg.shapeObject.attr('transform', `rotate(${(Date.now() - start) * speed * ($scope.$id & 1 ? 1 : -1)})`);
					});

					// function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount){

					// 	// const pathString = 'M0,0 L10,10';
					// 	const width      = 10 * hHoleCount * 4;
					// 	const height     = 10 * vHoleCount * 4;
					// 	let borderRadius = 2 * holeRadius * 4;
					// 	const stepH      = width / hHoleCount;
					// 	const stepW      = height / vHoleCount;
					// 	let pathString   = '';

					// 	pathString = `M${borderRadius},${height}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${-borderRadius}
					// 								v${-(height - 2 * borderRadius)}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
					// 								h${width - 2 * borderRadius}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
					// 								v${height - 2 * borderRadius}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
					// 								z`;
					// 	borderRadius /= 2;
					// 	for (let j = 0; j < vHoleCount; j++){
					// 		for (let i = 0; i < hHoleCount; i++){
					// 			pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
					// 										a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
					// 										a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
					// 										z`;
					// 		}
					// 	}
					// 	return pathString;
					// }

					// $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
					// 	.attr('d', drawRectWithHoles(2.5, 4, 1));

				});
			}
		};
	}
];
