module.exports = ['d3Factory',
	function (d3Factory){ // eslint-disable-line no-unused-vars

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',
			priority: 2,

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars

				d3Factory.d3().then(function (){
					$scope.shape.moniker = 'core.t';

					function drawTWithHoles(holeRadius, hHoleCount, vHoleCount){

						// const pathString = 'M0,0 L10,10';
						const width      = 10 * hHoleCount * 4;
						const height     = 10 * vHoleCount * 4;
						let borderRadius = 2 * holeRadius * 4;
						const stepH      = width / hHoleCount;
						const stepW      = height / vHoleCount;
						let pathString   = '';

						// rx,ry           - радиусы скругления дуги по X и Y
						// x-axis-rotation - угол вращения в градусах относительно текущей системы координат
						// large-arc-flag  - флаг большой дуги (если 1, то дуга > 180 deg)
						// sweepflag       - направление рисования (если 1, дуга рисуется по часовой стрелке)
						// x,y             - точка назначения

						pathString = `M${width / 2},${height}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${-borderRadius}
													v${-(height / vHoleCount * (vHoleCount - 1)) + borderRadius}
													h${-(width / hHoleCount) * (Math.floor(hHoleCount / 2)) + borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${-borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
													h${width - (2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
													h${-(width / hHoleCount) * (Math.floor(hHoleCount / 2)) + borderRadius}
													v${(height / vHoleCount * (vHoleCount - 1)) - borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
													z`;

						borderRadius /= 2;
						for (let j = 0; j < vHoleCount; j++){
							for (let i = 0; i < hHoleCount; i++){
								if (j === 0 || i === Math.floor(hHoleCount / 2)){
									pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
																a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
																a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
																z`;
								}
							}
						}
						return pathString;
					}

					$scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
						.attr('d', drawTWithHoles(2.5, 5, 3));

				});
			}
		};
	}
];
