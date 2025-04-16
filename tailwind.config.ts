
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				hero: {
					superman: '#ea384c',
					batman: '#403E43',
					wonderwoman: '#1EAEDB',
					flash: '#F97316',
					greenlantern: '#22c55e'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'flip-back': {
					'0%': { transform: 'rotateY(180deg)' },
					'100%': { transform: 'rotateY(0deg)' }
				},
				'card-hover': {
					'0%': { transform: 'translateZ(0)' },
					'100%': { transform: 'translateZ(10px)' }
				},
				'float-cloud': {
					'0%': { transform: 'translateX(-20%) translateZ(var(--z, -100px))' },
					'100%': { transform: 'translateX(120%) translateZ(var(--z, -100px))' }
				},
				'rain': {
					'0%': { transform: 'translateY(-10px) translateX(0)' },
					'100%': { transform: 'translateY(120vh) translateX(-20px)' }
				},
				'snow': {
					'0%': { transform: 'translateY(-10px) translateX(0) rotate(0deg)' },
					'25%': { transform: 'translateY(25vh) translateX(10px) rotate(45deg)' },
					'50%': { transform: 'translateY(50vh) translateX(-10px) rotate(90deg)' },
					'75%': { transform: 'translateY(75vh) translateX(10px) rotate(135deg)' },
					'100%': { transform: 'translateY(120vh) translateX(0) rotate(180deg)' }
				},
				'twinkle': {
					'0%, 100%': { opacity: '0.2' },
					'50%': { opacity: '0.7' }
				},
				'float-animation': {
					'0%': { transform: 'translateY(0) translateZ(10px) rotateX(0) rotateY(0)' },
					'50%': { transform: 'translateY(-10px) translateZ(20px) rotateX(2deg) rotateY(2deg)' },
					'100%': { transform: 'translateY(0) translateZ(10px) rotateX(0) rotateY(0)' }
				},
				'bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-25px)' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.6' }
				},
				'rise': {
					'0%': { transform: 'translateY(50px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flip': 'flip 0.6s ease-in-out forwards',
				'flip-back': 'flip-back 0.6s ease-in-out forwards',
				'card-hover': 'card-hover 0.3s ease-out forwards',
				'bounce': 'bounce 1.5s ease-in-out infinite',
				'pulse': 'pulse 2s ease-in-out infinite',
				'rise': 'rise 2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
