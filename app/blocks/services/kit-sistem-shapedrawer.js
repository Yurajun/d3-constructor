module.exports = function (){

	return {
		/**
		 * [drawGearWheel description]
		 * @param  {[type]} d3           [description]
		 * @param  {[type]} holder       [description]
		 * @param  {[type]} teeth        [description]
		 * @param  {[type]} radiusInner  [description]
		 * @param  {[type]} radiusOuter  [description]
		 * @param  {[type]} toothHeight  [description]
		 * @param  {[type]} innerAnnulus             - внутреннее кольцо
		 * @param  {[type]} outerAnnulus             - внешнее кольцо
		 * @param  {[type]} innerAnnulus.innerRadius - внутренний радиус внешнего кольца
		 * @param  {[type]} outerAnnulus.outerRadius - внешний радиус внешнего кольца
		 * @return {[type]}              [description]
		 */
		drawGearWheel(d3, holder, teeth, radiusInner, radiusOuter, toothHeight, innerAnnulus, outerAnnulus) {
			function drawGearWheel() {

				const rOuter = Math.abs(radiusOuter) * 4;
				const rInner = Math.abs(radiusInner) * 4;
				const rTooth = rOuter + (toothHeight * 4);
				const step   = Math.PI / teeth;
				const s      = step / 3;
				let a0       = -Math.PI / 2;
				let i        = -1;
				// const pathString = ['M0', -rOuter];
				// const pathString = ['M0', rOuter * Math.sin(-90)];
				const pathString = ['M0', rOuter * Math.sin(a0)];
				while (++i < teeth){

					pathString.push('A', rOuter, ',', rOuter, ' 0 0 1 ', rOuter * Math.cos(a0 += step), ',', rOuter * Math.sin(a0));
					// 360 / (N + N) = 180 / N
					pathString.push('L', rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0));
					pathString.push('A', rTooth, ',', rTooth, ' 0 0 1 ', rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0));
					pathString.push('L', rOuter * Math.cos(a0 += s), ',', rOuter * Math.sin(a0));

				}

				pathString.push(
						'M0', -rInner,
						'A', rInner, ',', rInner, ' 0 0 0 0,', rInner,
						'A', rInner, ',', rInner, ' 0 0 0 0,', -rInner,
						'z'
					);

				return pathString.join('');
			}

			const outerAnnulusF = d3.svg.arc()
				.innerRadius(outerAnnulus.innerRadius)  // 10
				.outerRadius(outerAnnulus.outerRadius)  // 32
				.startAngle(0)
				.endAngle(Math.PI * 2);

			const innerAnnulusF = d3.svg.arc()
				.innerRadius(innerAnnulus.innerRadius)  // 10
				.outerRadius(innerAnnulus.outerRadius)  // 20
				.startAngle(0)
				.endAngle(Math.PI * 2);

			holder.append('path')
				.attr('class', 'gear-outer-circle')
				.attr('d', outerAnnulusF);

			holder.append('path')
				.attr('class', 'gear-inner-circle')
				.attr('d', innerAnnulusF);

			return holder.append('path')
				.attr('class', 'gear')
				.attr('d', drawGearWheel(teeth, radiusInner, radiusOuter, toothHeight));

		},
		drawRect(d3, holder, holeRadius, hHoleCount, vHoleCount) {
			function drawRectWithHoles(){

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

			return holder.append('path')
				.attr('d', drawRectWithHoles(holeRadius, hHoleCount, vHoleCount));
		},
		drawTriange() {

		},
		drawTShape() {

		},
		drawScrew() {

		},

		getDrawingMethod(moniker) {
			switch (moniker){
				case 'core.gear':
					return this.drawGearWheel;
				case 'core.rect':
					return this.drawRect;
				case 'core.triangle':
					return this.drawTriangle;
				case 'core.t':
					return this.drawTShape;
				case 'core.screw':
					return this.drawScrew;
				default:
					return null;
			}
		}

	};

};
