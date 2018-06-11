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
					$scope.shape.moniker = 'core.screw';

					$scope.shape.svg.shapeObject = drawer.drawScrew(
						d3,
						$scope.shape.svg.d3Object,
						4,
						2
					);

					// $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
					// 	.attr('d', drawRectWithHoles(2.5, 4, 1));

				});
			}
		};
	}
];
