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
					$scope.shape.moniker = 'core.rect';

					function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount){

						// const pathString = 'M0,0 L10,10';
						const width      = 10 * hHoleCount * 4;
						const height     = 10 * vHoleCount * 4;
						let borderRadius = 2 * holeRadius * 4;
						const stepH      = width / hHoleCount;
						const stepW      = height / vHoleCount;
						let pathString   = '';

						pathString = `M${borderRadius},${height}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${-borderRadius}
													v${-(height - 2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
													h${width - 2 * borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
													v${height - 2 * borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
													z`;
						borderRadius /= 2;
						for (let j = 0; j < vHoleCount; j++){
							for (let i = 0; i < hHoleCount; i++){
								pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
															a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
															a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
															z`;
							}
						}
						return pathString;
					}

					$scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
						.attr('d', drawRectWithHoles(2.5, 4, 1));

				});
			}
		};
	}
];
