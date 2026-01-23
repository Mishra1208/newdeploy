import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

// Fix: Wrap card in a static wrapper for stable measurements
export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div className="scroll-stack-card-wrapper">
        <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
    </div>
);

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    scaleDuration = 0.5,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false, // We enabled this
    onStackComplete
}) => {
    const scrollerRef = useRef(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef(null);
    const lenisRef = useRef(null);
    const cardsRef = useRef([]); // This will now hold WRAPPERS
    const lastTransformsRef = useRef(new Map());
    const isUpdatingRef = useRef(false);

    // Helper: Percentage to px
    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }, []);

    // Helper: Get scroll/container info
    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
                scrollContainer: document.documentElement
            };
        } else {
            const scroller = scrollerRef.current;
            return {
                scrollTop: scroller.scrollTop,
                containerHeight: scroller.clientHeight,
                scrollContainer: scroller
            };
        }
    }, [useWindowScroll]);

    // Helper: Get element offset relative to document (or container)
    const getElementOffset = useCallback(
        element => {
            if (useWindowScroll) {
                // Since we measure WRAPPER now, this will be stable!
                const rect = element.getBoundingClientRect();
                return rect.top + window.scrollY;
            } else {
                return element.offsetTop;
            }
        },
        [useWindowScroll]
    );

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;
        isUpdatingRef.current = true;

        const { scrollTop, containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        // End element for pinning reference - Scope to scrollerRef for robustness
        const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');

        const endElementTop = endElement ? getElementOffset(endElement) : 0;

        cardsRef.current.forEach((wrapper, i) => {
            if (!wrapper) return;

            // TARGET INNER CARD for transform
            const card = wrapper.firstElementChild;
            if (!card) return;

            // MEASURE WRAPPER (Static)
            const cardTop = getElementOffset(wrapper);

            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            const pinEnd = endElementTop - containerHeight / 2;

            // Scale Logic
            // 0 = Scroll Top < Trigger Start
            // 1 = Scroll Top > Trigger End
            let scaleProgress = 0;
            if (scrollTop > triggerStart) {
                if (scrollTop < triggerEnd) {
                    scaleProgress = (scrollTop - triggerStart) / (triggerEnd - triggerStart);
                } else {
                    scaleProgress = 1;
                }
            }

            const targetScale = baseScale + i * itemScale;
            // Interpolate between 1 (full size) and targetScale (stacked size)
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

            // Blur Logic
            let blur = 0;
            if (blurAmount) {
                // Find which card is currently "top"
                let topCardIndex = 0;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jWrapper = cardsRef.current[j];
                    const jCardTop = getElementOffset(jWrapper);
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }
                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * blurAmount);
                }
            }

            // Translate Y (Pinning) Logic
            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                // Keep it fixed at stackPosition + offset
                // We simulate "fixed" by translating down as we scroll down
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                // Stick at the bottom of the pin area
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                rotation: Math.round(rotation * 100) / 100,
                blur: Math.round(blur * 100) / 100
            };

            // Optimization: Only write DOM if changed distinctively
            const lastTransform = lastTransformsRef.current.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
                Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransformsRef.current.set(i, newTransform);
            }

            // Completion callback
            if (i === cardsRef.current.length - 1) {
                const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (isInView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!isInView && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        parsePercentage,
        getScrollData,
        getElementOffset
    ]);

    const handleScroll = useCallback(() => {
        updateCardTransforms();
    }, [updateCardTransforms]);

    // Setup Lenis (Smooth Scrolling)
    const setupLenis = useCallback(() => {
        const lenisOptions = {
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.1,
        };

        if (useWindowScroll) {
            const lenis = new Lenis(lenisOptions);
            lenis.on('scroll', handleScroll);

            const raf = time => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);

            lenisRef.current = lenis;
            return lenis;
        } else {
            const scroller = scrollerRef.current;
            if (!scroller) return;

            const lenis = new Lenis({
                ...lenisOptions,
                wrapper: scroller,
                content: scroller.querySelector('.scroll-stack-inner'),
            });

            lenis.on('scroll', handleScroll);

            const raf = time => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);

            lenisRef.current = lenis;
            return lenis;
        }
    }, [handleScroll, useWindowScroll]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller && !useWindowScroll) return;

        // FIND WRAPPERS - Always scope to the scroller ref for safety
        const wrappers = Array.from(scrollerRef.current?.querySelectorAll('.scroll-stack-card-wrapper') || []);

        cardsRef.current = wrappers;
        const transformsCache = lastTransformsRef.current;

        // Init styles on WRAPPER or CARD
        wrappers.forEach((wrapper, i) => {
            // Add margin to wrapper to create scroll space
            if (i < wrappers.length - 1) {
                wrapper.style.marginBottom = `${itemDistance}px`;
            }

            const card = wrapper.firstElementChild;
            if (card) {
                card.style.willChange = 'transform, filter';
                card.style.transformOrigin = 'top center';
                // Ensure hardware acceleration
                card.style.transform = 'translateZ(0)';
            }
        });

        setupLenis();
        updateCardTransforms();

        window.addEventListener('resize', updateCardTransforms);

        return () => {
            window.removeEventListener('resize', updateCardTransforms);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (lenisRef.current) lenisRef.current.destroy();

            stackCompletedRef.current = false;
            cardsRef.current = [];
            transformsCache.clear();
            isUpdatingRef.current = false;
        };
    }, [
        itemDistance,
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        scaleDuration,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        setupLenis,
        updateCardTransforms
    ]);

    return (
        <div
            className={`scroll-stack-scroller ${className} ${useWindowScroll ? 'use-window-scroll' : ''}`.trim()}
            ref={scrollerRef}
        >
            <div className="scroll-stack-inner">
                {children}
                <div className="scroll-stack-end" />
            </div>
        </div>
    );
};

export default ScrollStack;
